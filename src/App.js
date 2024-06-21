import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/pages/Home";
import SignUp from './components/pages/SignUp';
import Signin from './components/pages/Signin';
import NewPosts from './components/pages/NewPosts';
import PostDetails from './components/pages/PostDetails';
import TagPost from './components/pages/TagPost';
import ImgurProvider from "./components/Context/ImgurContext";
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './reducer/store';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {

  return (
    <Provider store={store}>
      <ImgurProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/newposts' element={<NewPosts />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/postDetails/:_id' element={<PostDetails />} />
            <Route path='/tagPost/:_id' element={<TagPost />} />
          </Routes>
        </BrowserRouter>
      </ImgurProvider>
    </Provider>
  );
}

export default App;