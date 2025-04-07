import React, { useEffect, useState } from 'react';
import "./assignquiz.css";
import { useLocation , useNavigate} from 'react-router-dom';

const Assignquiz = () => {

  const naviagte = useNavigate();

  const location = useLocation();
  const { quizID } = location.state || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [checkedUsers, setCheckedUsers] = useState({});
  const [assignAll, setAssignAll] = useState(false);

  const [assignQuiz,setAssignQuiz] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [users,setUsers] = useState([]);

  useEffect(()=>{
    getUserList();
  },[]);

  const getUserList = async () =>{

    const response = await fetch(`http://localhost:8080/api/auth/get-users/${userId}`);

    if(!response.ok){
        console.log("Error fetching Users");
        return;
    }
    const data = await response.json();
    console.log(data);
    setUsers(data);

    data.forEach(element => {
        setAssignQuiz((prev) => ({
            ...prev,
            [element._id]: null
        }));
    });
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetSearch = () => {
    setSearchTerm("");
  };

  const handleAssignAll = () => {
    setAssignAll(!assignAll);
    setCheckedUsers(assignAll ? {} : Object.fromEntries(users.map(user => [user._id, true])));
  };

  const toggleUserSelection = (userId) => {
    setCheckedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const updateQuizToassigned = async (quizID) => {

    console.log("quizID",quizID);
    try{
      const response = await fetch(`http://localhost:8080/api/auth/update-quiz-to-assigned/${quizID}` ,{
        method: "PUT",
        headers:{
          "content-Type": "application/json"
        },
        body: JSON.stringify({assigned:true})
      });

      if(response.ok){
        naviagte("/landing");
      }

    }catch(err){
      console.log("error in updating the quiz",err)
    }

    
  }

  const assignQuizToUser = async(data) => {
    console.log(data);   
    try{
        const response = await fetch(`http://localhost:8080/api/auth/set-assign-quiz-to-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)            
        });

        if(response.ok){
            console.log("heer1")
        }
        console.log("heer2")
        updateQuizToassigned(quizID);
    }catch(err){
        console.log("error in assigning quiz",err)
    }

  }

  const handleDone = () => {
    /* handleAssignQuiz(); */    
    const newAssignQuiz = {};
    Object.keys(checkedUsers).forEach(userId => {
    if (checkedUsers[userId]===true) {
        newAssignQuiz[userId] = quizID;
    }
    });
    console.log(newAssignQuiz);
    setAssignQuiz(newAssignQuiz);
    
    if (Object.keys(newAssignQuiz).length > 0) {
        assignQuizToUser(newAssignQuiz);
    }
  };

  /* const handleAssignQuiz = () =>{
    console.log(checkedUsers);
  } */

  return (
    <div className='assign-quiz'>
      <div className='assign-quiz-container'>
        <h1 className='quiz-title'>Assign Your Quiz</h1>
        
        <div className='search-container'>
          <input 
            type='text' 
            placeholder='Search users...' 
            className='search-box'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='reset-btn' onClick={resetSearch}>Reset</button>
        </div>
        
        <div className='user-assign-div'>
          {filteredUsers.length > 0 ? (
            <ul className='user-assign-list'>
              {filteredUsers.map((user) => (
                <li 
                  key={user._id} 
                  className={`user-item ${assignAll || checkedUsers[user._id] ? 'selected' : ''}`} 
                  onClick={() => toggleUserSelection(user._id)}
                >
                  <input 
                    type='checkbox' 
                    id={`user-${user._id}`} 
                    className='user-checkbox' 
                    checked={assignAll || checkedUsers[user._id] || false}
                    readOnly
                  />
                  <div className='user-info'>
                    <div className='user-pic'></div>
                    <div className='user-detail'>
                      <h4 className='user-name'>{user.username}</h4>
                      <span className='user-email'>{user.email}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='no-user-found'>No users found</div>
          )}
        </div>
        
        <div className='assign-all'>
          <input 
            type='checkbox' 
            id='assign-all' 
            className='assign-all-checkbox' 
            checked={assignAll} 
            onChange={handleAssignAll} 
          />
          <label htmlFor='assign-all' className='assign-all-label'>Assign to all</label>
        </div>

        <button className='assign-btn' onClick={()=>{handleDone()}} >Done</button>
      </div>
    </div>
  );
};

export default Assignquiz;
