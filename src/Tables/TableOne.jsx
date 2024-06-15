import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { ImEye } from "react-icons/im";
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

const TableOne = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'profiles'));
            const usersList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setUsers(usersList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users: ", error);
            setLoading(false);
        }
    };

    console.log(users.length);

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUserHandler = async (userId, referralCode) => {
        try {
            await deleteDoc(doc(db, 'profiles', userId));
            console.log(`User with ID ${userId} deleted successfully`);
    
            const q = query(collection(db, 'profiles'), where('referralByCode', '==', referralCode));
            const querySnapshot = await getDocs(q);
    
            const batch = writeBatch(db);
            querySnapshot.forEach((userDoc) => {
                batch.update(userDoc.ref, {
                    referralByCode: '',
                    referrerID: ''
                });
            });
    
            await batch.commit();
            console.log(`Users updated successfully`);
    
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user or updating referrals: ', error);
        }
    };
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <div className='flex flex-col justify-between md:flex-row'>
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                        All Users
                    </h4>
                    {/* <div className="mb-10 mt-5 md:mt-0 md:mb-0">
                        <form>
                            <div className="relative">
                                <button className="absolute left-0 top-1/2 -translate-y-1/2">
                                    <svg
                                        className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                            fill=""
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                            fill=""
                                        />
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    placeholder='Search by Name...'
                                    className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white md:w-50 "
                                />
                            </div>
                        </form>
                    </div> */}
                </div>
                {loading ? (
                    <div className='border-t border-[#eee] py-5 px-4 pl-9 dark:border-strokedark'>
                        <h4 className="mb-6 text-md font-semibold text-center text-black dark:text-white">
                            Loading...
                        </h4>
                    </div>
                ) : users.length === 0 ? (
                    <div className='border-t border-[#eee] py-5 px-4 pl-9 dark:border-strokedark'>
                        <h4 className="mb-6 text-md font-semibold text-center text-black dark:text-white">
                            No Data Available
                        </h4>
                    </div>
                ) : (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">First Name</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Surname</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Referral By Code</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Referral Code</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <p className="text-black dark:text-white">{user.firstName}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.surname}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.email}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.referralByCode}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.referralCode}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button className="hover:text-primary" onClick={() => deleteUserHandler(user.id, user.referralCode)}>
                                                <MdDeleteForever />
                                            </button>
                                            <Link to={`/update-user/${user.id}`}>
                                                <button className="hover:text-primary">
                                                    <MdEdit />
                                                </button>
                                            </Link>
                                            <Link to={`/profile/${user.id}`}>
                                                <button className="hover:text-primary">
                                                    <ImEye />
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TableOne;
