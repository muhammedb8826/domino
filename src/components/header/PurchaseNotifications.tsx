import Loader from "@/common/Loader";
import { NotificationTable } from "./NotificationTable";
import Breadcrumb from "../Breadcrumb";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUsers } from "@/redux/features/user/userSlice";
import { getProducts } from "@/redux/features/product/productSlice";
import { createNote, getNotes } from "@/redux/features/purchaseNotesSlice";
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import { getPurchasesById, updatePurchase } from "@/redux/features/purchaseSlice";
import { PurchaseNotificationTable } from "./PurchaseNotificationTable";
import { getUnits } from "@/redux/features/unit/unitSlice";

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);
let hours = date.getHours();
const minutes = String(date.getMinutes()).padStart(2, '0');
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12;
const strTime = hours + ':' + minutes + ' ' + ampm;

export const PurchaseNotifications = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { singlePurchase, isLoading, error } = useSelector((state) => state.purchase);
    const { units } = useSelector((state) => state.unit);
    const { products } = useSelector((state: RootState) => state.product);

    const { id } = useParams<{ id: string }>();
    const { purchaseNotes } = useSelector((state) => state.purchaseNote);
    const { users } = useSelector((state) => state.user);
    const [receiveReadyPurchases, setReceiveReadyPurchases] = useState([]);
    const [pendingApprovalPurchases, setPendingApprovalPurchases] = useState([]);
    const [active, setActive] = useState("pending");
    const [expandedNotes, setExpandedNotes] = useState([]);
    const [newNotes, setNewNotes] = useState([]);
    const [formData, setFormData] = useState([]);
    const handleButtonClick = (newActiveState: string) => {
        setActive(newActiveState);
    };

    const [showPopover, setShowPopover] = useState<number | null>(null);
    const [showPopover2, setShowPopover2] = useState<number | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverRef2 = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<any>(null);
    const dropdownRef = useRef<any>(null);
    const [note, setNote] = useState(purchaseNotes || []);
    const dispatch = useDispatch();


    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (showPopover !== null && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
            setShowPopover(null);
        }
        if (showPopover2 !== null && popoverRef2.current && !popoverRef2.current.contains(event.target as Node)) {
            setShowPopover2(null);
        }
    }, [showPopover, showPopover2]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPopover, showPopover2, handleClickOutside]);

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdownRef.current || !dropdownOpen || dropdownRef.current.contains(target) || triggerRef.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, [dropdownOpen]);

    useEffect(() => {
        const keyHandler = ({ key }: KeyboardEvent) => {
            if (dropdownOpen && key === 'Escape') setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [dropdownOpen]);

    const handleAction = (index: number) => setShowPopover(prevIndex => (prevIndex === index ? null : index));
    const handlePendingApprovalAction = (index: number) => setShowPopover2(prevIndex => (prevIndex === index ? null : index));

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getProducts());
        dispatch(getUnits());
        dispatch(getNotes()).then((res) => {
            if (res.payload) {
              const notesData = res.payload.flatMap(noteGroup => noteGroup.notes);
              setNote(notesData);
            }
          });
        dispatch(getPurchasesById(id)).then((response) => {
            const { products } = response.payload;
            setFormData(products);
            setPendingApprovalPurchases(products.filter((item) => item.status === "Purchased" || item.status === "Rejected"));
            setReceiveReadyPurchases(products.filter((item) => item.status === "Approved" || item.status === "Received"));
        });
    }, [dispatch, id]);

    const handleUpdateNote = (id, newNote, index, setExpandedNotes, expandedNotes) => {
        setNote((prevNote) => [...prevNote, ...newNote]);
        setNewNotes([])

        const updatedExpandedNotes = expandedNotes.map((expanded, expandedIndex) =>
            expandedIndex === index ? true : expanded
        );
        setExpandedNotes(updatedExpandedNotes)
    };

    const handleChangeNotes = (index, value, id) => {
        const newNote = {
            id: uuidv4(),
            note: value,
            productsId: id,
            userId: user?.id,
            date: formattedDate,
            hour: strTime
        };

        // Create a copy of existing newNotes array and insert the newNote at the specified index
        const updatedNotes = [...newNotes];
        updatedNotes[index] = newNote;
        setNewNotes(updatedNotes);
    };

    const handleUpdatePendingApproval = (id, status, index) => {
        if (user?.email === "admin@domino.com" || user?.roles === "finance") {
            const updatedOrderItems = pendingApprovalPurchases.map((item) =>
                item.id === id ? { ...item, status: status } : item
            );
            setPendingApprovalPurchases(updatedOrderItems);
            setFormData([...updatedOrderItems, ...receiveReadyPurchases]);
            handleAction(index)
        }
        else {
            const message = "You are not authorized to edit this order";
            toast.error(message);
        }
    };

    const handleUpdateReceiveReady = (id, status, index) => {
        if (user?.roles === "store-representative" || user?.email === "admin@domino.com") {
            const updatedOrderItems = receiveReadyPurchases.map((item) =>
                item.id === id ? { ...item, status: status } : item
            );
            setReceiveReadyPurchases(updatedOrderItems);
            setFormData([...updatedOrderItems, ...pendingApprovalPurchases]);
            handlePendingApprovalAction(index)
        } else {
            const message = "You are not authorized to edit this order";
            toast.error(message);
        }
    };

    const removeDuplicates = (notes) => {
        const uniqueNotes = notes.filter((note, index, self) =>
            index === self.findIndex((n) => (
                n?.id === note?.id
            ))
        );
        return uniqueNotes;
    };

    const handleSubmit = () => {
        const data = {
            id: id,
            ...singlePurchase,
            products: formData
        }
        const noteData = {
            notes: removeDuplicates(note),
        }

        dispatch(updatePurchase(data)).then((res) => {
            if (res.payload) {
                const { products } = res.payload;
                setFormData(products);
                setPendingApprovalPurchases(products.filter((item) => item.status === "Purchased" || item.status === "Rejected"));
                setReceiveReadyPurchases(products.filter((item) => item.status === "Approved" || item.status === "Received"));
                toast.success("Purchase order updated successfully")

                dispatch(createNote(noteData)).then((res) => {
                    if (res.payload) {
                        const { notes } = res.payload;
                        setNote(notes);
                    }
                    else {
                        const message = "Something went wrong!";
                        toast.error(message);
                    }
                });
            } else {
                const message = "Something went wrong!";
                toast.error(message);
            }
        });
    };
    return isLoading ? (
        <Loader />
    ) : (
        <>
            <Breadcrumb pageName="Notifications" />
            <div className="rounded-sm border border-stroke border-t-0 bg-white px-4 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <nav className="flex justify-between gap-4 items-center px-4">
                    <ul className="list-reset py-4 rounded flex bg-white dark:bg-boxdark dark:text-white">
                        <li className="text-gray-500 text-sm dark:text-gray-400">
                            <button
                                type="button"
                                onClick={() => handleButtonClick("pending")}
                                className={`${active === "pending" ? "text-white bg-black" : ""
                                    } px-5 py-1.5 font-medium text-graydark`}
                            >
                                Pending Approval
                            </button>
                        </li>
                        <li className="text-gray-500 text-sm dark:text-gray-400">
                            <button
                                type="button"
                                onClick={() => handleButtonClick("receive")}
                                className={`${active === "receive" ? "text-white bg-black" : ""
                                    } px-5 py-1.5 font-medium text-graydark`}
                            >
                                Receive Ready
                            </button>
                        </li>
                    </ul>
                    < button
                        type="submit"
                        onClick={handleSubmit}
                        className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Save changes
                    </button>
                </nav>
                {active === "pending" && (
                    <PurchaseNotificationTable
                        title="Pending approval purchases"
                        orders={pendingApprovalPurchases}
                        handleAction={handleAction}
                        showPopover={showPopover}
                        handleModalOpen={handleUpdatePendingApproval}
                        handleUpdateNote={handleUpdateNote}
                        popoverRef={popoverRef}
                        users={users}
                        note={removeDuplicates(note)}
                        products={products}
                        units={units}
                        status1={{ label: "Approve", value: "Approved" }}
                        status2={{ label: "Reject", value: "Rejected" }}
                        expandedNotes={expandedNotes}
                        setExpandedNotes={setExpandedNotes}
                        handleChangeNotes={handleChangeNotes}
                        newNotes={newNotes}
                    />
                )}
                {active === "receive" && (
                    <PurchaseNotificationTable
                        title="Pending approval orders"
                        orders={receiveReadyPurchases}
                        handleAction={handlePendingApprovalAction}
                        showPopover={showPopover2}
                        handleModalOpen={handleUpdateReceiveReady}
                        handleUpdateNote={handleUpdateNote}
                        popoverRef={popoverRef2}
                        users={users}
                        note={removeDuplicates(note)}
                        products={products}
                        units={units}
                        status1={{ label: "Receive", value: "Received" }}
                        status2={{ label: "Reject", value: "Rejected" }}
                        expandedNotes={expandedNotes}
                        setExpandedNotes={setExpandedNotes}
                        handleChangeNotes={handleChangeNotes}
                        newNotes={newNotes}
                    />
                )}
            </div>
        </>
    );
}
