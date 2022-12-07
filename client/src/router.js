import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import AdminPage from './pages/AdminPage/AdminPage';
import AdminPageAddRealEstate from './pages/AdminPage/AdminPageAddRealEstate';
import AdminPageFees from './pages/AdminPage/AdminPageFees';
import AdminNFTCardConfiguration from './pages/AdminPage/AdminNFTCardConfiguration';
import AdminPageOverview from './pages/AdminPage/AdminPageOverview';
import Homepage from './pages/Homepage/Homepage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Listings from './pages/Homepage/Listings/Listings';
import ListingsOne from './pages/Homepage/Listings/ListingsOne';
import ListingsOverview from './pages/Homepage/Listings/ListingsOverview';
import MarketPlace from './pages/Homepage/Marketplace/MarketPlace';
import MarketPlaceOverview from './pages/Homepage/Marketplace/MarketplaceOverview';
import MyNfts from './pages/Homepage/Profile/MyNFTs';
import Profile from './pages/Homepage/Profile/Profile';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true, // = path : '/'
                element: <Homepage />,
            },
            {
                path: 'admin',
                element: <AdminPage />,
                children: [
                    {
                        index: true,
                        element: <AdminPageOverview />
                    },
                    {
                        path: "addrealestate",
                        element: <AdminPageAddRealEstate />,
                    },
                    {
                        path: "nftcardconfig",
                        element: <AdminNFTCardConfiguration />,
                    },
                    {
                        path: "fees",
                        element: <AdminPageFees />,
                    },
                ]
            },
            {
                path: 'listings',
                element: <Listings />,
                children: [
                    {
                        index: true,
                        element: <ListingsOverview />,
                    },
                    {
                        path: "view/:id",
                        element: <ListingsOne />,
                    },
                ]
            },
            {
                path: 'marketplace',
                element: <MarketPlace />,
                children: [
                    {
                        index: true,
                        element: <MarketPlaceOverview />,
                    },
                ]
            },
            {
                path: 'profile',
                element: <Profile />,
                children: [
                    {
                        index: true,
                        element: <MyNfts />,
                    },
                ]
            },
        ],
    },
]);