import styles from "./Footer.module.scss"

function Footer() {
    return (
        <footer className={`${styles.footer} d-flex flex-row align-items-center justify-content-center p-20`}>
            <p>Copyright @2023 ROCK, Inc.</p>
        </footer>
    );

}

export default Footer;