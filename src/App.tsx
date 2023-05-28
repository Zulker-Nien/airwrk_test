import { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";

interface Data {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  actions: string;
}

const App = () => {
  const [data, setData] = useState<Data[]>([]);
  const [rehydration, setRehydration] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage] = useState<number>(10);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Data | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedUsername, setEditedUsername] = useState<string>("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setData(response.data);
        setRehydration(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [dataPerPage]);

  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const currentData = data.slice(firstIndex, lastIndex);

  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    setRehydration(true);
  };
  const totalPages: number = Math.ceil(data.length / dataPerPage);
  const pageNumbers: number[] = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const openEditModal = (item: Data): void => {
    setSelectedItem(item);
    setEditedName(item.name);
    setEditedEmail(item.email);
    setEditedUsername(item.username);
    setModal(true);
  };

  const saveChanges = (): void => {
    if (selectedItem) {
      const updatedData = data.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: editedName,
              email: editedEmail,
              username: editedUsername,
            }
          : item
      );
      setData(updatedData);
      setModal(false);
    }
  };

  return (
    <>
      <table className="tableContainer">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        {rehydration && (
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td className="actions">
                  <p onClick={() => openEditModal(item)}>Edit</p>
                  <p
                    onClick={() => {
                      alert("Under Development");
                    }}
                  >
                    Delete
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>

      {modal && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Row</h2>
            <form>
              <label>
                Name:
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
              </label>
              <label>
                Username:
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={saveChanges}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
