import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

export default function Todo() {
  const [taskList, setTaskList] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  function onSubmit(data) {
    console.log(taskList);
    const taskObj = {
      task: data.Task,
      completed: false,
    };
    reset();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in first!");
      return;
    }
    fetch("https://to-do-app-backend-6vxg.onrender.com/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskObj),
    })
      .then((response) => response.json())
      .then((result) => {
        getTask();
        // setTaskList((prevList) => [...prevList, result.newTask]);
        console.log("Task successfully posted to API:", result);
      })
      .catch((error) => {
        console.error("Error posting task:", error);
      });
  }

  useEffect(() => {
    getTask();
  }, []);

  function getTask() {
    const token = localStorage.getItem("token");
    fetch("https://to-do-app-backend-6vxg.onrender.com/todo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTaskList(data.tasks);
        } else {
          console.error("Failed to load tasks");
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }

  function taskCompletion(index) {
    const task = taskList[index];
    const updatedStatus = !task.isCompleted;
    console.log("Task object:", task);
    console.log("Task ID:", task.id);

    fetch(`https://to-do-app-backend-6vxg.onrender.com/todo/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: updatedStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const updatedList = [...taskList];
          updatedList[index].isCompleted = updatedStatus;
          setTaskList(updatedList);
        } else {
          console.error("Failed to update task status");
        }
      })
      .catch((error) => console.error("Error updating task:", error));
  }

  function deleteTask(id) {
    fetch(`https://to-do-app-backend-6vxg.onrender.com/todo/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTaskList((prevTasks) =>
            prevTasks.filter((task) => task.id !== id)
          );
        } else {
          console.error("Failed to delete task status");
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  }

  const totalTask = taskList.length;
  const updatedTask = taskList.filter((task) => task.isCompleted).length;
  const remainingTask = totalTask - updatedTask;

  return (
    <>
      <section className="bg-[#242424] text-white rounded-2xl w-full  lg:min-w-[680px] h-auto py-6 px-4 sm:px-8 mx-auto text-center shadow-[0_0_15px_2px_#343434cc]">
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="pb-5 text-[28px] sm:text-[35px] font-bold">
              To-Do List
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <input
                type="text"
                placeholder="Enter a task"
                {...register("Task", { required: "Name is Required" })}
                className="w-full sm:w-auto flex-1 px-6 py-2 bg-[aliceblue] text-black rounded-lg border-none text-center focus:outline-green-700"
              />

              <button className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition sm:w-[100px] lg:w-[150px]">
                Add
              </button>
            </div>
            <div className="flex flex-col px-[20px] lg:px-[60px] sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-6">
              <p className="bg-[rgb(29,123,92)] px-6 py-2 rounded-xl w-full sm:w-auto">
                Total Task: {totalTask}
              </p>
              <p className="bg-[rgb(29,123,92)] px-6 py-2 rounded-xl w-full sm:w-auto">
                Completed Task: {updatedTask}
              </p>
              <p className="bg-[rgb(29,123,92)] px-6 py-2 rounded-xl w-full sm:w-auto">
                Remaining Task: {remainingTask}
              </p>
            </div>

            <h4 className="text-lg font-semibold mt-8">Added Tasks:</h4>

            <ul className="list-none mt-4 space-y-3">
              {taskList.map((task, index) => (
                <li
                  key={index}
                  className={`${task.isCompleted ? "line-through" : ""}`}
                >
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-lg my-2 px-4 py-3 gap-2 sm:gap-4 transition ${
                      task.isCompleted
                        ? "bg-[rgb(95,98,95)]"
                        : "bg-[rgb(224,219,219)] text-black"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => taskCompletion(index)}
                        className="mr-2 accent-green-600 w-3 h-3"
                      />
                      <span>{task.task}</span>
                    </div>
                    <MdDelete
                      onClick={() => deleteTask(task.id)}
                      className="cursor-pointer text-red-500 hover:text-red-700 self-end sm:self-auto"
                      size={22}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </section>
    </>
  );
}
