import styles from "./HeaderMenuXS.module.scss";

function HeaderMenuXS() {
    return (
        <ul className={`${styles.MenuContainer} card p-20`}>
            <li>Coups de coeur</li>
            <li>Connexion</li>
        </ul>
    );
}

export default HeaderMenuXS;