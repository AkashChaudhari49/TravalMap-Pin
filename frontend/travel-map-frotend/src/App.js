import './App.css';
import * as React from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { useState, useEffect } from 'react';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import axios from "axios";
import { format } from 'timeago.js';
import Register from './component/Register';
import Login from './component/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser ] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [addNewPlace, setAddNewPlace] = useState(null)
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    longitude: 78.8718,
    latitude: 21.7679,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/pins");
        //console.log(res);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getPins();
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  }

  const handleAddClick = (e) => {
    // console.log(e);
    const [long, lat] = e.lngLat;
    setAddNewPlace({
      long,
      lat
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin ={
      username:currentUser,
      title,
      desc,
      rating,
      lat:addNewPlace.lat,
      long:addNewPlace.long
    }

    try {
      const res = await axios.post("http://localhost:8000/api/pins", newPin);
      setPins([...pins, res.data]);
      setAddNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  }

  const handleLogout =()=>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  };


  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPAPI}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins && pins.map(p => (
          <>
            <Marker longitude={p.long}
              latitude={p.lat}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 4}
             
            >
              <RoomIcon style={{ fontsize: viewport.zoom * 7, color: p.username === currentUser ? 'tomato' : "slateblue", cursor: "pointer" }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)} />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
              key={p._id}
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<StarIcon className="star" />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span>

              </div>
            </Popup>
            )
            }
          </>
        ))}
        
        {currentUser && addNewPlace && (
          <Popup
            longitude={addNewPlace.long}
            latitude={addNewPlace.lat}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setAddNewPlace(null)}
          >
            <div>
              <form className='popup-form' onSubmit={handleSubmit}>
                <label>Title</label>
                <input onChange={(e)=>setTitle(e.target.value)} type="text" placeholder='enter title' />
                <label>Reviews</label>
                <textarea onChange={(e)=>setDesc(e.target.value)} type="text" placeholder='Say somthing about this place' />
                <label>Rating</label>
                <select onChange={(e)=>setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                </select>
                <button className='submitButton'>Submit</button>
              </form>
            </div>
          </Popup>
        )}
    
        {currentUser ?  <button className='button logout' onClick={handleLogout}>Log out</button> :
         <div className='buttons'>
         <button onClick={()=>setShowLogin(true)} className='button login'>Login</button>
    
         <button onClick={()=>setShowRegister(true)} className='button register'>Register</button>
         </div>}

        { showRegister &&  <Register setShowRegister={setShowRegister } /> }
        { showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/> }
      </ReactMapGL>
    </div>
  );
}

export default App;
