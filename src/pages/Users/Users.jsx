import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Loading from "../../component/Loading/Loading";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // State to manage selected user
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    // Refs for GSAP animations
    const modalRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                return response.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
                // Animate user cards on data fetch
                gsap.from(cardRefs.current, {
                    opacity: 0,
                    y: 50,
                    stagger: 0.1,
                    duration: 0.9,
                    ease: "power2.out",
                });
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Animate modal on open/close
    useEffect(() => {
        if (isModalOpen) {
            gsap.from(modalRef.current, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power2.out",
            });
        }
    }, [isModalOpen]);

    // Function to open the modal and set the selected user
    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        gsap.to(modalRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.in",
            onComplete: () => {
                setIsModalOpen(false);
                setSelectedUser(null);
            },
        });
    };

    // Function to handle outside click
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-950">
                Users List
            </h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {users.map((user, index) => (
                    <li
                        key={user.id}
                        className="p-4 border rounded-lg shadow-md text-gray-950"
                        ref={(el) => (cardRefs.current[index] = el)} // Assign ref to each card
                    >
                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>City:</strong> {user.address.city}
                        </p>
                        <button
                            className="mt-2 px-4 py-2 bg-gray-950 text-white rounded hover:bg-gray-800"
                            onClick={() => handleViewDetails(user)}
                        >
                            View Details
                        </button>
                    </li>
                ))}
            </ul>

            {/* Modal with overlay */}
            {isModalOpen && selectedUser && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleOutsideClick} // Handle outside click
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-gray-950"
                        ref={modalRef} // Ref for modal animation
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            User Details
                        </h2>
                        <p>
                            <strong>Name:</strong> {selectedUser.name}
                        </p>
                        <p>
                            <strong>Username:</strong> {selectedUser.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedUser.email}
                        </p>
                        <p>
                            <strong>Address:</strong>{" "}
                            {selectedUser.address.street},{" "}
                            {selectedUser.address.suite},{" "}
                            {selectedUser.address.city},{" "}
                            {selectedUser.address.zipcode}
                        </p>
                        <p>
                            <strong>Phone:</strong> {selectedUser.phone}
                        </p>
                        <p>
                            <strong>Website:</strong> {selectedUser.website}
                        </p>
                        <p>
                            <strong>Company:</strong>{" "}
                            {selectedUser.company.name}
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-gray-950 text-white rounded hover:bg-gray-800"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
