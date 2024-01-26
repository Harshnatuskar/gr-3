import React, { useEffect, useState } from "react";

const url = "http://localhost:3000/tasks";

interface Task {
    id: number;
    task: string;
    completed: boolean;
}

export const TaskApp: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [task, setTask] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleAddTask = async () => {
        try {
            const newTask = { task, completed: false };
            const options = {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(newTask),
            };
            const response = await fetch(url, options);
            const data = await response.json();
            setTasks((prevTasks) => [...prevTasks, data]);
            setTask("");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await fetch(`${url}/${id}`, { method: "DELETE" });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleToggleCompleted = async (id: number) => {
        try {
            const taskToToggle = tasks.find((task) => task.id === id);

            if (taskToToggle) {
                const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };
                const options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify(updatedTask),
                };

                const response = await fetch(`${url}/${id}`, options);

                if (response.ok) {
                    const data = await response.json();
                    const updatedTasks = tasks.map((task) => (task.id === id ? data : task));
                    setTasks(updatedTasks);
                } else {
                    console.error("Error updating task:", response.statusText);
                }
            }
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    };

    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button onClick={() => handleAddTask()}>Add</button>
            </form>

            <table>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td
                                style={{
                                    textDecoration: task.completed ? "line-through" : "none",
                                }}
                                onClick={() => handleToggleCompleted(task.id)}
                            >
                                {task.task}
                            </td>
                            <td>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
