import React, { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'Auth';
import routes from 'routes';
import { useLogout } from '../Api';
import { InfoModal } from '../Modal';
import { Footer } from './Footer';
import { Header, MenuItem } from './Header';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const pathname = location.pathname;
    const { user, logout } = useAuth();
    const [apiLogout, { data: logoutData }] = useLogout();

    useEffect(() => {
        if (logoutData) {
            logout();
            closeLogoutModal();
        }
    }, [logoutData]);

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    const onClickLogout = () => {
        apiLogout();
        setShowLogoutModal(true);
    };

    const items: Array<MenuItem> = [
        {
            label: t('menuSets'),
            url: routes.SETS,
            isActive: !!matchPath(routes.SETS, pathname),
            isVisible: !!user,
        },
        {
            label: t('menuCreateSet'),
            url: routes.CREATE,
            isActive: !!matchPath(routes.CREATE, pathname),
            isVisible: !!user,
        },
        {
            label: t('menuStudySet'),
            url: pathname,
            isActive: true,
            isVisible: !!user && !!matchPath(routes.SET, pathname),
        },
        {
            label: t('menuEditSet'),
            url: pathname,
            isActive: true,
            isVisible: !!user && !!matchPath(routes.EDIT, pathname),
        },
        {
            label: t('menuFlashcards'),
            url: pathname,
            isActive: true,
            isVisible: !!user && !!matchPath(routes.FLASHCARDS, pathname),
        },
        {
            label: t('menuLogout'),
            url: '',
            isActive: false,
            isVisible: !!user,
            onClick: onClickLogout,
        },
        {
            label: t('menuLogin'),
            url: routes.LOGIN,
            isActive: false,
            isVisible:
                !user &&
                (matchPath(routes.SIGNUP_REQUEST, pathname) ||
                    matchPath(routes.SIGNUP_CONFIRM, pathname) ||
                    matchPath(routes.PASSWORD_RESET, pathname)),
        },
        {
            label: t('menuSignup'),
            url: routes.SIGNUP_REQUEST,
            isActive: false,
            isVisible: !user && (matchPath(routes.LOGIN, pathname) || matchPath(routes.SIGNUP_CONFIRM, pathname)),
        },
    ].filter((item) => item.isVisible);

    return (
        <>
            <Header menuItems={items} />

            <main className="main">
                <div className="container main__body">{children}</div>
                <InfoModal isOpen={showLogoutModal} onClose={closeLogoutModal} body={t('loggingOut')} />
            </main>

            <Footer />
        </>
    );
};

export default Layout;
