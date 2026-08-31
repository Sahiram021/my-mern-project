import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './assets/components/pages/Login'
import Layout from './assets/components/pages/common/Layout'
import Dashboard from './assets/components/pages/Dashboard'
import AddColor from './assets/components/pages/color/AddColor'
import ViewColors from './assets/components/pages/color/ViewColors'
import AddMaterial from './assets/components/pages/material/AddMaterial'
import ViewMaterials from './assets/components/pages/material/ViewMaterials'
import AddCategory from './assets/components/pages/parentCategory/AddCategory'
import ViewCategories from './assets/components/pages/parentCategory/ViewCategories'
import AddSubCategory from './assets/components/pages/subCategory/AddSubCategory'
import ViewSubCategories from './assets/components/pages/subCategory/ViewSubCategories'
import AddSubSubCategory from './assets/components/pages/subSubCategory/AddSubSubCategory'
import ViewSubSubCategories from './assets/components/pages/subSubCategory/ViewSubSubCategories'
import AddProduct from './assets/components/pages/product/AddProduct'
import ViewProducts from './assets/components/pages/product/ViewProducts'
import AddCountry from './assets/components/pages/country/AddCountry'
import ViewCountries from './assets/components/pages/country/ViewCountries'
import AddFaq from './assets/components/pages/faq/AddFaq'
import ViewFaqs from './assets/components/pages/faq/ViewFaqs'
import ToastNotification from './assets/components/common/notification/ToastNotification'
import {
  AddTerms,
  ViewTerms
} from './assets/components/pages/StaticPages'
import ProductDetails from './assets/components/pages/product/ProductDetails'
import EnquiryList from './assets/components/pages/enquirys/EnquiryList'
import ProfilePage from './assets/components/pages/ProfilePage'
import CompanyProfile from './assets/components/pages/company/CompanyProfile'
import ForgotPassword from './assets/components/pages/whyChooseUs/forgot-password/ForgotPassword'
import ResetPassword from './assets/components/pages/whyChooseUs/reset-password/ResetPassword'
import AddWhyChooseUs from './assets/components/pages/whyChooseUs/AddWhyChooseUs'
import ViewWhyChooseUs from './assets/components/pages/whyChooseUs/ViewWhyChooseUs'
import AddSlider from './assets/components/pages/slider/AddSlider'
import ViewSliders from './assets/components/pages/slider/ViewSliders'
import ViewOrders from './assets/components/pages/order/ViewOrders'

function App() {
    return (
        <BrowserRouter>
            <ToastNotification />
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/color/add' element={<AddColor />} />
                    <Route path='/color/edit/:id' element={<AddColor />} />
                    <Route path='/color/view' element={<ViewColors />} />
                    <Route path='/material/add' element={<AddMaterial />} />
                    <Route path='/material/edit/:id' element={<AddMaterial />} />
                    <Route path='/material/view' element={<ViewMaterials />} />
                    <Route path='/category/add' element={<AddCategory />} />
                    <Route path='/category/edit/:id' element={<AddCategory />} />
                    <Route path='/category/view' element={<ViewCategories />} />
                    <Route path='/sub-category/add' element={<AddSubCategory />} />
                    <Route path='/sub-category/edit/:id' element={<AddSubCategory />} />
                    <Route path='/sub-category/view' element={<ViewSubCategories />} />
                    <Route path='/sub-sub-category/add' element={<AddSubSubCategory />} />
                    <Route path='/sub-sub-category/edit/:id' element={<AddSubSubCategory />} />
                    <Route path='/sub-sub-category/view' element={<ViewSubSubCategories />} />
                    <Route path='/product/add' element={<AddProduct />} />
                    <Route path='/product/view' element={<ViewProducts />} />
                    <Route path='/product/view/:id' element={<ProductDetails />} />
                    <Route path='/product/edit/:id' element={<AddProduct />} />
                    <Route path='/orders/view' element={<ViewOrders />} />
                    <Route path='/sliders/add' element={<AddSlider />} />
                    <Route path='/sliders/edit/:id' element={<AddSlider />} />
                    <Route path='/sliders/view' element={<ViewSliders />} />
                    <Route path='/country/add' element={<AddCountry />} />
                    <Route path='/country/edit/:id' element={<AddCountry />} />
                    <Route path='/country/view' element={<ViewCountries />} />
                    <Route path='/faqs/add' element={<AddFaq />} />
                    <Route path='/faqs/edit/:id' element={<AddFaq />} />
                    <Route path='/faqs/view' element={<ViewFaqs />} />
                    <Route path='/why-choose-us/add' element={<AddWhyChooseUs />} />
                    <Route path='/why-choose-us/edit/:id' element={<AddWhyChooseUs />} />
                    <Route path='/why-choose-us/view' element={<ViewWhyChooseUs />} />
                    <Route path='/terms/add' element={<AddTerms />} />
                    <Route path='/terms/view' element={<ViewTerms />} />
                    <Route path='/enquiry/view' element={<EnquiryList />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='/company-profile' element={<CompanyProfile />} />
                </Route>
                <Route path='/' element={<Login />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password/:id' element={<ResetPassword />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

