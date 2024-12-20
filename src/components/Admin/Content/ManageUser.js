
import ModalCreateUser from "./ModalCreateUser";
import './ManageUser.scss'
import { FcPlus } from "react-icons/fc";
import TableUser from "./TableUser";
import { useEffect, useState } from "react";
import { getAllUsers, getUserWithPaginate } from "../../../services/apiServices";
import ModalUpdateUser from "./ModalUpdateUser"
import ModalViewUser from "./ModalViewUser";
import ModalDeleteUser from "./ModalDeleteUser";
import TableUserPaginate from "./TableUserPaginate"
const ManageUser = (props) => {
    const [showModalCreateUser, setShowModalCreateUser] = useState(false);
    const [showModalUpdateUser, setShowModalUpdateUser] = useState(false);
    const [showModalViewUser, setShowModalViewUser] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [listUsers, setListUsers] = useState([])
    const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);
    const [dataDelete, setDataDelete] = useState({});
    // paginate
    const LIMIT_USER = 5;
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    // useEffect han che loi
    useEffect(() => {
        // fetchListUsers();
        fetchListUsersPaginate(1);
    }, [])
    const fetchListUsers = async () => {
        let res = await getAllUsers();
        if (res.EC === 0) {
            setListUsers(res.DT);
        }
    }
    const fetchListUsersPaginate = async (page) => {
        let res = await getUserWithPaginate(page, LIMIT_USER);
        if (res.EC === 0) {
            setListUsers(res.DT.users);
            setPageCount(res.DT.totalPages)
        }
    }
    const handleClickBtnUpdate = (user) => {
        setShowModalUpdateUser(true);
        setDataUpdate(user);
    }
    const handleClickBtnView = (user) => {
        setShowModalViewUser(true);
        setDataUpdate(user);
    }
    const resetUpdateData = () => {
        setDataUpdate({});
    }
    const handleClickBtnDelete = (user) => {
        setShowModalDeleteUser(true);
        setDataDelete(user);
    }
    return (
        <div className="manage-user-container">
            <div className="title">
                Manage User
            </div>
            <div className="users-content">
                <div className="btn-add-new">
                    <button className="btn btn-primary" onClick={() => setShowModalCreateUser(true)}>
                        <FcPlus />Add new users </button>
                </div>
            </div>
            <div className="table-users-container">
                {/* <TableUser
                    listUsers={listUsers}
                    handleClickBtnUpdate={handleClickBtnUpdate}
                    handleClickBtnView={handleClickBtnView}
                    handleClickBtnDelete={handleClickBtnDelete}

                /> */}
                <TableUserPaginate
                    listUsers={listUsers}
                    handleClickBtnUpdate={handleClickBtnUpdate}
                    handleClickBtnView={handleClickBtnView}
                    handleClickBtnDelete={handleClickBtnDelete}
                    fetchListUsersPaginate={fetchListUsersPaginate}
                    pageCount={pageCount}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />

            </div>
            <ModalCreateUser
                show={showModalCreateUser}
                setShow={setShowModalCreateUser}
                fetchListUsers={fetchListUsers}
                fetchListUsersPaginate={fetchListUsersPaginate}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage} />
            <ModalUpdateUser
                show={showModalUpdateUser}
                setShow={setShowModalUpdateUser}
                dataUpdate={dataUpdate}
                fetchListUsers={fetchListUsers}
                resetUpdateData={resetUpdateData}
                fetchListUsersPaginate={fetchListUsersPaginate}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}


            />
            <ModalViewUser
                show={showModalViewUser}
                setShow={setShowModalViewUser}
                dataUpdate={dataUpdate}
                fetchListUsers={fetchListUsers}
                resetUpdateData={resetUpdateData}
                fetchListUsersPaginate={fetchListUsersPaginate}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}

            />

            <ModalDeleteUser
                show={showModalDeleteUser}
                setShow={setShowModalDeleteUser}
                dataDelete={dataDelete}
                fetchListUsers={fetchListUsers}
                fetchListUsersPaginate={fetchListUsersPaginate}// gọi lại ds user
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

        </div >
    )
}
export default ManageUser;