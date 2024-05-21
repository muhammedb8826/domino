import { getUsers } from "@/redux/features/user/userSlice";
import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { SiMicrosoftonenote } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export const PurchaseNotificationTable = ({
  title,
  orders,
  handleAction,
  showPopover,
  handleModalOpen,
  handleUpdateNote,
  popoverRef,
  users,
  note,
  products,
  units,
  status1,
  status2,
  expandedNotes,
  setExpandedNotes,
  handleChangeNotes,
  newNotes,
}) => {

  useEffect(() => {
    if (expandedNotes.length === 0) {
      setExpandedNotes(new Array(orders.length).fill(false));
    }
  }, [setExpandedNotes.length, orders.length]);


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
                  Description
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Quantity
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Unit price
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  UoM
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
                  const unit =
                    data.unitId &&
                    units?.find((unit) => unit.id === data.unitId);
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
                          {data.description}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {data.quantity}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {data.unitPrice}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {unit?.name}
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
                                <li>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleModalOpen(
                                        data.id,
                                        status1.value,
                                        index,
                                      )
                                    }
                                    className="flex items-center w-full gap-2 px-4 py-2 font-medium text-primary dark:text-primary hover:underline hover:bg-gray-100"
                                  >
                                    <FaRegEdit />
                                    {status1.label}
                                  </button>
                                </li>

                                {status2.value !== "" && (
                                  <li>
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
                            <div className="grid grid-cols-3 gap-4 border-stroke dark:border-strokedark h-36 overflow-hidden p-2">
                              <div className="col-span-2">
                                <ul className="flex flex-col overflow-y-scroll h-30 pe-2 gap-2.5" id="style-4">
                                  {note?.filter(n => n?.productsId === data.id).length === 0 && (
                                    <li className="mb-2">No notes found</li>
                                  )}

                                  {note?.filter(n => n?.productsId === data.id).map((n, noteIndex) => {
                                    const user = users.find(u => u.id === n.userId);
                                    return (
                                      <li key={noteIndex} className="flex flex-col gap-2.5 border-t border-stroke shadow-2 px-4.5 py-3 bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                                        <p className="">
                                          <span className="text-black dark:text-white">
                                            {n.note}
                                          </span>{' '}

                                        </p>

                                        <p className="text-xs">Note added by {user?.first_name} on {n.date} at {n.hour}</p>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                              <div className="add-notes">
                                <textarea
                                  title="note"
                                  name="note"
                                  id={`note-${index}`}
                                  onChange={(e) =>
                                    handleChangeNotes(index, e.target.value, data.id)
                                  }
                                  value={newNotes[index]?.note || ""}
                                  className="p-2 h-20 w-full rounded bg-gray-2 text-left font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                <button onClick={() => handleUpdateNote(data.id, newNotes, index, setExpandedNotes, expandedNotes)} type="button" className="text-black dark:text-white bg-gray-2 border-stroke dark:border-strokedark dark:bg-meta-4 mt-2 p-1 button text-center w-full" title="add note">
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
