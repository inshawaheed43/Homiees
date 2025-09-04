
import 'leaflet/dist/leaflet.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/Signin.jsx';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './Components/Header.jsx';
import Privateroute from './Components/Privateroute';
import CreateListing from './pages/CreateListing.jsx'
import UpdateListing from './pages/UpdateListing.jsx';
import Listing from './pages/Listing.jsx';
import SignUp2 from './pages/SignUp2.jsx';
import Search from './pages/Search.jsx';
import Layout from './Components/layout.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ChatRoom from "./pages/ChatRoom.jsx";
import AdminSignin from './pages/AdminSignin.jsx';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminListings from "./pages/admin/AdminListings.jsx";
import AdminChats from "./pages/admin/AdminChats.jsx";
import AdminBannedUsers from "./pages/admin/AdminBannedUsers.jsx";
import HelpCenter from "./pages/HelpCenter"; // 👈 for tenants & landlords
import AdminHelpCenter from "./pages/admin/AdminHelpCenter.jsx"; // 👈 for admin
import ChatListPage from './pages/ChatListPage';
import ChatRoomWrapper from './pages/ChatRoomWrapper.jsx'; // 👈 for tenants & landlords
import UserProfile from './pages/UserProfile.jsx';
import AdminChatroomView from './Components/AdminChatroomView.jsx';


export default function App() {
  return (



    <BrowserRouter>
      <Layout >
        <Header />
        <Routes>
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-up-2' element={<SignUp2 />} />
          <Route path="/chatroom/:chatId" element={<ChatRoom />} />
          <Route path="/chats" element={<ChatListPage />} />
          <Route path="/chat-inbox" element={<ChatRoomWrapper />} />

          <Route path='/about' element={<About />} />
          <Route path='/listing/:listingId' element={<Listing />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/users" element={<AdminUsers />} />
          <Route path="/admin-dashboard/listings" element={<AdminListings />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/admin-dashboard/help-requests" element={<AdminHelpCenter />} />
          <Route path="/admin-dashboard/chats" element={<AdminChats />} />
          <Route path="/admin-dashboard/banned-users" element={<AdminBannedUsers />} />
          <Route path='/search' element={<Search />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path="/admin-signin" element={<AdminSignin />} />
          <Route path="/admin/chatroom/:chatId" element={<AdminChatroomView />} />





          <Route element={<Privateroute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route
              path='/update-listing/:listingId'
              element={<UpdateListing />}
            />
          </Route>




        </Routes>
      </Layout>
    </BrowserRouter>



  );
}
