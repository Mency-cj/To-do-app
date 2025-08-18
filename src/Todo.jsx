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
    fetch("http://localhost:5000/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json","Authorization": `Bearer ${token}`
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

  function getTask(){
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/todo",{
      method: "GET",
      headers: {
        "Content-Type": "application/json","Authorization": `Bearer ${token}`
      }
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

    fetch(`http://localhost:5000/todo/${task.id}`, {
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
    fetch(`http://localhost:5000/todo/${id}`, {
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
      <section className="bg-[#242424] text-white rounded-2xl w-[680px] h-auto py-5 mx-auto text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="pb-5 text-[35px]">To-Do List</h2>

            <input
              type="text"
              placeholder="Enter a task"
              {...register("Task", { required: "Name is Required" })}
              className="px-8 py-2 bg-[aliceblue] text-black rounded-lg border-none mr-2 text-center"
            />

            <button className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition">
              Add
            </button>

            <div className="flex justify-between px-[60px] pt-5 pb-[30px]">
              <p className="bg-[rgb(29,123,92)] px-8 py-2 rounded-xl">
                Total Task: {totalTask}
              </p>
              <p className="bg-[rgb(29,123,92)] px-8 py-2 rounded-xl">
                Completed Task: {updatedTask}
              </p>
              <p className="bg-[rgb(29,123,92)] px-8 py-2 rounded-xl">
                Remaining Task: {remainingTask}
              </p>
            </div>

            <h4 className="text-lg font-semibold">Added Tasks:</h4>

            <ul className="list-none">
              {taskList.map((task, index) => (
                <li
                  key={index}
                  className={`${task.isCompleted ? "line-through" : ""}`}
                >
                  <div
                    className={`flex items-center justify-between rounded-lg mx-15 my-4 px-4 py-2 ${
                      task.isCompleted
                        ? "bg-[rgb(95,98,95)]"
                        : "bg-[rgb(224,219,219)] text-black"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => taskCompletion(index)}
                      className="mr-2 accent-green-600 w-3 h-3"
                    />
                    <span>{task.task}</span>
                          <MdDelete
                      onClick={() => deleteTask(task.id)}
                      className="cursor-pointer  text-red-500 hover:text-red-700" size={22}
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
