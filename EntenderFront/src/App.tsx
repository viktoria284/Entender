import './styles.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from "./Routes/Routes";
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from './Store/AuthSlice';
import { useEffect } from 'react';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  
  return (
    <>
      <BrowserRouter>
          <ToastContainer />
          <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App
