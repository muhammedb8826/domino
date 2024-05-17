import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { SiMicrosoftonenote } from "react-icons/si";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);
let hours = date.getHours();
const minutes = String(date.getMinutes()).padStart(2, '0');
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; 
const strTime = hours + ':' + minutes + ' ' + ampm;

export const NotificationTable = ({
  title,
  orders,
  handleAction,
  showPopover,
  handleModalOpen,
  handleUpdateNote,
  popoverRef,
  user,
  note,
  products,
  services,
  status1,
  status2,
}) => {
  const [datas, setDatas] = useState([]);
  const [notes, setNotes] = useState([
    {
      id: uuidv4(),
      note: "",
      orderItemsId: "",
      date: formattedDate,
      time: "",
      user: user?.id
    },
  ]);
  const [expandedNotes, setExpandedNotes] = useState([]);

  useEffect(() => {
    setDatas(orders.map(({ width, height }) => ({ width, height })));
    const newNotes = orders.map(() => ({
      id: uuidv4(),
      note: "",
      orderItemsId: "",
      date: formattedDate,
      time: "",
      user: user?.id
    }));
    setNotes(newNotes);
    setExpandedNotes(new Array(orders.length).fill(false))
  }, [orders, note]);

  const handleInputChanges = (index, field, value) => {
    const updatedDatas = datas.map((data, dataIndex) =>
      dataIndex === index ? { ...data, [field]: value } : data
    );
    setDatas(updatedDatas);
  };

  const handleNotes = (index, value, id) => {
    const updatedNotes = notes.map((note, noteIndex) =>
      noteIndex === index ? { ...note, note: value, orderItemsId: id, time: strTime } : note
    );
    setNotes(updatedNotes);
  };

  console.log(notes);
  

  const handleExpandNotes = (index) => {
    const updatedExpandedNotes = expandedNotes.map((expanded, expandedIndex) =>
      expandedIndex === index ? !expanded : expanded
    );
    setExpandedNotes(updatedExpandedNotes);
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <div>
        <span className="text-black dark:text-white w-full py-2 px-4 border-t border-b border-[#eee] mb-4 font-semibold flex items-center gap-4">
          {title}
        </span>
        <div className="max-w-full px-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  No
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Product
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Services
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Width
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Height
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Quantity
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Note
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No data found
                  </td>
                </tr>
              )}
              {orders &&
                orders.length > 0 &&
                orders.map((data, index) => {
                  const product =
                    data.productId &&
                    products?.find((product) => product.id === data.productId);
                  const service =
                    data.serviceId &&
                    services?.find((service) => service.id === data.serviceId);

                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="border-b text-graydark border-[#eee] py-2 px-4 dark:border-strokedark">
                          {index + 1}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {product?.name}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {service?.name}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <input
                            title="width"
                            type="number"
                            name="width"
                            id="width"
                            onChange={(e) =>
                              handleInputChanges(index, "width", e.target.value)
                            }
                            value={datas[index]?.width || ""}
                            className="w-full rounded bg-transparent font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            required
                            min={0}
                          />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <input
                            title="height"
                            type="number"
                            name="height"
                            id="height"
                            onChange={(e) =>
                              handleInputChanges(
                                index,
                                "height",
                                e.target.value
                              )
                            }
                            value={datas[index]?.height || ""}
                            className="w-full rounded bg-transparent font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            required
                            min={0}
                          />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {data.quantity}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {data.status}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <button
                            title="notes"
                            type="button"
                            onClick={() => handleExpandNotes(index)}
                          >
                            <SiMicrosoftonenote />
                          </button>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <button
                            onClick={() => handleAction(index)}
                            title="action"
                            type="button"
                            className="text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                          >
                            <CiMenuKebab />
                          </button>
                          {showPopover === index && (
                            <div
                              ref={popoverRef}
                              className="absolute z-40 right-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                            >
                              <ul className="py-2 text-sm text-gray-700">
                                <li
                                  className={`${user?.email !== "admin@domino.com" &&
                                    user?.roles !== "graphic-designer"
                                    ? "hidden"
                                    : ""
                                    }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleModalOpen(
                                        data.id,
                                        status1.value,
                                        index,
                                        datas[index].width,
                                        datas[index].height
                                      )
                                    }
                                    className="flex items-center w-full gap-2 px-4 py-2 font-medium text-primary dark:text-primary hover:underline hover:bg-gray-100"
                                  >
                                    <FaRegEdit />
                                    {status1.label}
                                  </button>
                                </li>

                                {status2.value !== "" && (
                                  <li
                                    className={`${user?.email !== "admin@domino.com" &&
                                      user?.roles !== "graphic-designer"
                                      ? "hidden"
                                      : ""
                                      }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleModalOpen(
                                          data.id,
                                          status2.value,
                                          index
                                        )
                                      }
                                      className="flex items-center w-full gap-2 px-4 py-2 font-medium text-primary dark:text-primary hover:underline hover:bg-gray-100"
                                    >
                                      <FaRegEdit />
                                      {status2.label}
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                      {expandedNotes[index] && (
                        <tr key={`${index}-notes`} className="notes-row">
                          <td
                            colSpan={9}
                            className="relative border-b border-[#eee] dark:border-strokedark"
                          >
                            <div className="grid grid-cols-3 gap-4 border border-[#eee] h-36 overflow-hidden p-2">
                              <div className="col-span-2">
                                <ul className="overflow-y-scroll h-30" id="style-4">
                                  {notes?.filter(n => n.orderItemsId === data.id).length === 0 && (
                                    <li className="mb-2">No notes found</li>
                                  )}
                                  {notes?.filter(n => n.orderItemsId === data.id).map((n, noteIndex) => (
                                    <li key={noteIndex} className="mb-2 bg-gray-2 p-2">{n.note}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="add-notes">
                                {notes[index] && (
                                <textarea
                                  title="note"
                                  name="note"
                                  id={`note-${index}`}
                                  onChange={(e) =>
                                    handleNotes(index, e.target.value, data.id)
                                  }
                                  value={notes[index]?.note || ""}
                                  className="p-2 h-20 w-full rounded bg-gray-2 text-left font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                )}
                                <button onClick={() => handleUpdateNote(data.id, notes, index, setNotes)} type="button" className="mt-2 p-1 button text-center bg-gray-2 w-full" title="add note">
                                  Add Note
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                   </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
