import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./components/pages/Home";
import SignUp from './components/pages/SignUp';
import Signin from './components/pages/Signin';
import Newpost from './components/pages/Newpost';
import CommentPost from './components/pages/CommentPost';
import PostCategory from './components/pages/PostCategory';
import ImgurProvider from "./components/Context/ImgurContext";
function App() {
  
  return (
    <ImgurProvider>
        <BrowserRouter>
           <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/newpost' element={<Newpost/>}/>
              <Route path='/signup' element={<SignUp/>}/>
              <Route path='/signin' element={<Signin/>}/>
              <Route path='/commentPost' element={<CommentPost/>}/>
              <Route path='/commentPost/:_id' element={<CommentPost/>}/>
              <Route path='/postcategory/:tagId' element={<PostCategory/>}/>
           </Routes>
        </BrowserRouter>
    </ImgurProvider>
  );
}

export default App;
