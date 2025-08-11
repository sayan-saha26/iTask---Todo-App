import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [todo, setTodo] = useState("") // todo is our i/p text
  const [todos, setTodos] = useState([]) // todos is array, holds all todo in array
  const [showFinished, setShowFinished] = useState(true) // to show or hide completed todos

  // useEffect loads all the todos
  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) { // if todoString is not null then if clause will work
      let todos = JSON.parse(todoString)
      setTodos(todos)
    }
  }, [])

  // for saving todos into local storage
  const saveToLS = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };


  const toggleFinished = (e) => {
    setShowFinished(!showFinished)
  }

  const handleAdd = () => {
    const newTodo = { id: uuidv4(), todo, isCompleted: false }; // making newTodo object
    const newTodos = [...todos, newTodo]; // created new array using spread op. which have existing array from todos, newTodo added at end 
    setTodos(newTodos);
    setTodo(""); // clears the input box
    saveToLS(newTodos); // updated array passed, for storing into local storage
  }


  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleEdit = (e, id) => {
    let t = todos.filter((i) => i.id === id)
    setTodo(t[0].todo) // t[0] accesses the first and only item in the filtered array.
    // todo will be deleted from the row, after clicking edit. 
    // It keeps only those items where item.id is not equal to the selected id

    // after electing edit that todo will be deleted
    let newTodos = todos.filter((item) => {
      return item.id != id
    })
    setTodos(newTodos);
    saveToLS(newTodos);
  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos);
    saveToLS(newTodos);
  }

  const handleCheckbox = (e) => {
    let id = e.target.name // Gets the id of the todo from the checkbox’s name attribute.
    let index = todos.findIndex((item) => { // Finds the index of the todo in the todos array.
      return (item.id === id);
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted // toggles, if false then make true and reverse

    setTodos(newTodos);
    saveToLS(newTodos);
  }


  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 p-5 rounded-xl bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className='font-bold text-center text-xl'>iTask - Manage your todos at one place</h1>
        <div className='addTodo my-5 flex flex-col gap-4'>
          <h2 className='font-bold text-lg'>Add a Todo</h2>

          <div className="flex">
            <input onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-1' />
            <button onClick={handleAdd} disabled={todo.length <= 3}
              className='bg-violet-700 disabled:bg-violet-400 hover:bg-violet-800 p-4 py-2 text-sm font-bold text-white rounded-full mx-2'>
              Save</button>
          </div>

        </div>
        <input onChange={toggleFinished} type="checkbox" checked={showFinished} className='my-4' /> Show Finished
        <div className=' h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
        <h2 className='font-bold text-lg'>Your Todos</h2>

        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to Display</div>}
          {todos.map((item) => {

            return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex justify-between my-3">

              <div className='flex gap-5'>
                <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>

              <div className="buttons flex h-full">
                <button onClick={(e) => { handleEdit(e, item.id) }} className='bg-violet-700 hover:bg-violet-800 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                  <FaEdit /></button>
                <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-700 hover:bg-violet-800 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                  <MdDelete /></button>
              </div>
            </div>
          })}

        </div>
      </div>
    </>
  )
}

export default App
