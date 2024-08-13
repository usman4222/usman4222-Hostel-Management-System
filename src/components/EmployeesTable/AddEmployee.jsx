import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { FaImage } from 'react-icons/fa';
import Spinner from '../Spinner';
import { useSnackbar } from 'notistack';
import SelectGroupOne from '../../components/SelectGroup/SelectGroupOne';

const AddEmployee = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState('');
    const [fName, setFName] = useState('');
    const [regNo, setRegNo] = useState('');
    const [bFormNo, setBFormNo] = useState('');
    const [studyProgress, setStudyProgress] = useState('');
    const [behaviour, setBehaviour] = useState('');
    const [residenceDuration, setResidenceDuration] = useState('');
    const [deathCertificateImg, setDeathCertificateImg] = useState(null);
    const [chosenDeathCertificateImg, setChosenDeathCertificateImg] = useState(null);
    const [studentClass, setStudentClass] = useState('');
    const [school, setSchool] = useState('');
    const [relation, setRelation] = useState('');
    const [gurdianIdCardImg, setGurdianIdCardImg] = useState(null);
    const [chosenGurdianIdCardImg, setChosenGurdianIdCardImg] = useState(null);
    const [gurdianPhone, setGurdianPhone] = useState('');
    const [image, setImage] = useState(null);
    const [chosenImage, setChosenImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [isOptionSelected, setIsOptionSelected] = useState(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setChosenImage(file ? file.name : null);
    };

    const handleDeathCertificateChange = (e) => {
        const file = e.target.files[0];
        setChosenDeathCertificateImg(file);
        setDeathCertificateImg(file ? file.name : null);
    };

    const handleGurdianIdCardChange = (e) => {
        const file = e.target.files[0];
        setChosenGurdianIdCardImg(file);
        setGurdianIdCardImg(file ? file.name : null);
    };

    const handleProfileDetails = async (e) => {
        e.preventDefault();
        setLoading(true);


        try {

            const profileImageRef = await uploadImage(image);
            const deathCertificateRef = await uploadImage(deathCertificateImg);
            const gurdianIdCardRef = await uploadImage(gurdianIdCardImg);
            await addDoc(collection(db, 'students'), {
                name,
                fName,
                regNo,
                bFormNo,
                studyProgress,
                behaviour,
                residenceDuration,
                studentClass,
                school,
                relation,
                gurdianPhone,
                profileImage: profileImageRef,
                deathCertificateImg: deathCertificateRef,
                gurdianIdCardImg: gurdianIdCardRef
            });
            console.log("Document successfully written!");

            setName('');
            setFName('');
            setRegNo('');
            setBFormNo('');
            setStudyProgress('');
            setBehaviour('');
            setResidenceDuration('');
            setStudentClass('');
            setSchool('');
            setRelation('');
            setGurdianPhone('');
            setImage(null);
            setDeathCertificateImg(null);
            setGurdianIdCardImg(null);
            setChosenImage(null);

            navigate('/allemployees');
        } catch (error) {
            console.error('Error storing students details:', error);
            console.log('Other errors:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setChosenImage(file ? file.name : null);
    };

    const uploadImage = async () => {
        if (!image) return '';

        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        return getDownloadURL(storageRef);
    };


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add New Student" />

            {/* <div className=" flex justify-center items-center ">
                <div className="flex flex-col ">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Student Form
                            </h3>
                        </div>
                        <form encType='multipart/form-data' onSubmit={handleProfileDetails}>
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                            required
                                            placeholder='Enter Name'
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Father Name
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => setFName(e.target.value)}
                                            value={fName}
                                            required
                                            placeholder='Enter Father Name'
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Registration No.
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setRegNo(e.target.value)}
                                        value={regNo}
                                        required
                                        placeholder='Enter Registration No.'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        B-Form No.
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setBFormNo(e.target.value)}
                                        value={bFormNo}
                                        placeholder='Enter B-Form No.'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <div className="relative mb-2.5 flex text-black dark:text-white">
                                        <h6 className=" text-[16px]">Profile Image</h6>
                                    </div>
                                    <div className="pb-5 ">
                                        <div className="flex items-center justify-center">
                                            <label className="w-full flex gap-3 items-center rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 focus-within:ring-2 text-white cursor-pointer focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary hover:ring-1 hover:ring-[#363636]/30 transition-all ease-in-out">
                                                <FaImage className="text-xl mb-1 text-[#5F5F5F]" />
                                                <span className="text-[#5F5F5F]">
                                                    {chosenImage || 'Choose an image...'}
                                                </span>
                                                <input
                                                    type="file"
                                                    className="opacity-0 w-0 h-0"
                                                    onClick={(e) => e.target.value = null}
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Study Progress
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setStudyProgress(e.target.value)}
                                        value={studyProgress}
                                        required
                                        placeholder='Enter Study Progress'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Behaviour
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setBehaviour(e.target.value)}
                                        value={behaviour}
                                        required
                                        placeholder='Enter Behaviour'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Duration of Residence
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setResidenceDuration(e.target.value)}
                                        value={residenceDuration}
                                        placeholder='Enter Duration of Residence'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    {loading ? <Spinner /> : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> */}
            {/* <div className="grid grid-cols-12 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9"> */}
            {/* <!-- Contact Form --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Student Form
                    </h3>
                </div>
                <form action="#">
                    <div className="p-6.5">
                        <div className="mb-2.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your first name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="w-full xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Father Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your last name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5 xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Registration No.
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setRegNo(e.target.value)}
                                    value={regNo}
                                    required
                                    placeholder='Enter Registration No.'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5 xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    B-Form No.
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setBFormNo(e.target.value)}
                                    value={bFormNo}
                                    placeholder='Enter B-Form No.'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>









                        <div className="mb-2.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <div className="relative mb-2.5 flex text-black dark:text-white">
                                    <h6 className="text-[16px]">Profile Image</h6>
                                </div>
                                <div className="pb-5">
                                    <div className="flex items-center justify-center">
                                        <label className="w-full flex gap-3 items-center rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 focus-within:ring-2 text-white cursor-pointer focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary hover:ring-1 hover:ring-[#363636]/30 transition-all ease-in-out">
                                            <FaImage className="text-xl mb-1 text-[#5F5F5F]" />
                                            <span className="text-[#5F5F5F]">
                                                {chosenImage || 'Choose an image...'}
                                            </span>
                                            <input
                                                type="file"
                                                className="opacity-0 w-0 h-0"
                                                onClick={(e) => e.target.value = null}
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full xl:w-1/2">
                                <div className="relative flex mb-2.5 text-black dark:text-white">
                                    <h6 className="text-[16px]">Father Death Certificate Image</h6>
                                </div>
                                <div className="pb-5">
                                    <div className="flex items-center justify-center">
                                        <label className="w-full flex gap-3 items-center rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 focus-within:ring-2 text-white cursor-pointer focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary hover:ring-1 hover:ring-[#363636]/30 transition-all ease-in-out">
                                            <FaImage className="text-xl mb-1 text-[#5F5F5F]" />
                                            <span className="text-[#5F5F5F]">
                                                {chosenDeathCertificateImg || 'Choose an image...'}
                                            </span>
                                            <input
                                                type="file"
                                                className="opacity-0 w-0 h-0"
                                                onClick={(e) => e.target.value = null}
                                                onChange={handleDeathCertificateChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="mb-2.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Study Progress
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setStudyProgress(e.target.value)}
                                value={studyProgress}
                                required
                                placeholder='Enter Study Progress'
                                className="w-full mb-4.5 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>







                        <div className="mb-2.5 flex flex-col gap-6 xl:flex-row">
                            <div className="mb-4.5 xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Behaviour
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setBehaviour(e.target.value)}
                                    value={behaviour}
                                    required
                                    placeholder='Enter Behaviour'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5 xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Duration of Residence
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setResidenceDuration(e.target.value)}
                                    value={residenceDuration}
                                    placeholder='Enter Duration of Residence'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5 xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Relation
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setRelation(e.target.value)}
                                    value={relation}
                                    placeholder="Enter gurdian relation"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5 xl:w-80">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Phone No.
                                </label>
                                <input
                                    type="number"
                                    onChange={(e) => setGurdianPhone(e.target.value)}
                                    value={gurdianPhone}
                                    placeholder="Enter Phone No."
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>




                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="mb-4.5 xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    {' '}
                                    Select Class{' '}
                                </label>

                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        onChange={(e) => setStudentClass(e.target.value)}
                                        value={studentClass}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? 'text-black dark:text-white' : ''
                                            }`}
                                    >
                                        <option value="" disabled className="text-body dark:text-bodydark">
                                            Select your class
                                        </option>
                                        <option value="USA" className="text-body dark:text-bodydark">
                                            Class 1
                                        </option>
                                        <option value="UK" className="text-body dark:text-bodydark">
                                            Class 2
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 3
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 4
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 5
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 6
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 7
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 8
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 9
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 10
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 11
                                        </option>
                                        <option value="Canada" className="text-body dark:text-bodydark">
                                            Class 12
                                        </option>
                                    </select>

                                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                        <svg
                                            className="fill-current"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.8">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                    fill=""
                                                ></path>
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4.5 xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    {' '}
                                    Select School{' '}
                                </label>

                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        onChange={(e) => setSchool(e.target.value)}
                                        value={school}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? 'text-black dark:text-white' : ''
                                            }`}
                                    >
                                        <option value="" disabled className="text-body dark:text-bodydark">
                                            Select your school
                                        </option>
                                        <option value="USA" className="text-body dark:text-bodydark">
                                            Khaliqia Government School
                                        </option>
                                        <option value="UK" className="text-body dark:text-bodydark">
                                            Khaliqia Government Higher Secondary School
                                        </option>
                                    </select>

                                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                        <svg
                                            className="fill-current"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.8">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                    fill=""
                                                ></path>
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Phone No.
                            </label>
                            <input
                                type="number"
                                onChange={(e) => setGurdianPhone(e.target.value)}
                                value={gurdianPhone}
                                placeholder="Enter Phone No."
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Onboard Student
                        </button>
                    </div>
                </form>
            </div>

            {/* </div>
            </div >  */}
        </DefaultLayout >
    );
};

export default AddEmployee;
