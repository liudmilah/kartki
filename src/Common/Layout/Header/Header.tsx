import React, { useState } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import './index.css';

const logoTitleStyle = { fontFamily: "'Indie Flower', sans-serif" };

export type MenuItem = {
    label: string;
    url: string;
    isActive: boolean;
    onClick?: () => void;
};
type Props = {
    menuItems: Array<MenuItem>;
};

function Header({ menuItems }: Props) {
    const [activeBurgerMenu, setActiveBurgerMenu] = useState(false);

    const handleClickBurgerMenu = () => {
        setActiveBurgerMenu(!activeBurgerMenu);
    };

    const onClickLink = (onClick?: () => void) => () => {
        setActiveBurgerMenu(false);
        if (onClick) {
            onClick();
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header__body">
                    <Logo
                        appTitle="Kartki"
                        imgSrc="/logo192.png"
                        imgHeight={40}
                        imgWidth={40}
                        titleStyle={logoTitleStyle}
                    />

                    <div className={cx('header__burger', { active: activeBurgerMenu })} onClick={handleClickBurgerMenu}>
                        <span />
                    </div>

                    <nav className={cx('header__menu', { active: activeBurgerMenu })}>
                        <ul className="header__list">
                            {menuItems.map((item: MenuItem) => (
                                <li key={item.label}>
                                    <Link
                                        className={cx('header__link', { header__link_underline: item.isActive })}
                                        to={item.url}
                                        onClick={onClickLink(item.onClick)}
                                        dangerouslySetInnerHTML={{ __html: item.label }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
