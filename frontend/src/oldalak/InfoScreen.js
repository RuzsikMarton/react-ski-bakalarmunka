import React from "react";
import {Helmet} from "react-helmet-async";
import {Button, Container, Row} from "react-bootstrap";
import felvono1 from "../img/felvono1.jpg"
import felvono2 from "../img/felvono2.jpg"
import {Link, useNavigate} from "react-router-dom";

function InfoScreen(props) {
    const navigate = useNavigate();
    const userInfo = props;
    const navSkipass = () => {
        navigate('/skipass')
    }
    const navKolcson = () => {
        navigate('/search')
    }
    return(
        <div>
            <Helmet><title>Siközpont</title></Helmet>
            <section className="home" id="home">
                <div className="text">
                    <h1>Siközpont bakalármunka</h1>
                    <p>Skipass vásárlás, szállás foglalás, siléc kölcsönzés.<br/>
                        Nyitva tartás 2023. december 1-től 2024. március 31-ig.</p>
                    {userInfo.userInfo == null ? (<Link to="/signin">Itt jelentkezhetsz be</Link>) : (<Link to="/skipass">Skipass vásárlása</Link>)}
                </div>
            </section>

            <div className={"info-head"}>
                <Container>
                    <div className={"info-heading-wrapper"}>
                        <h1 className={"info-heading"}><br/>HA SÍELNI, AKKOR ITT</h1>
                        <p className={"info-head-para"}>Akár barátaival, akár családjával, akár gyakorlott síelőként vagy kezdőként érkezik, sikozpontunk olyan tevékenységeket és gyönyörű környezetet kínál, amelyet imádni fog.</p>
                        <Button className={"btn-info"} onClick={navSkipass}>Skipass</Button>
                    </div>
                </Container>
            </div>
            <div className={"info-main"}>
                <Container>
                    <div className={"info-main-top-wrapper"}>
                        <div className={"info-main-top-left"}>
                            <h2 className={"info-main-top-lefth2"}>A síelés egyértelmű!</h2>
                            <div className={"text-uppercase"}>3 fajta síbérlet:</div>
                        </div>
                        <div className={"info-main-top-right"}>
                            <p>Az üdülőhely több mint 7 km tökéletesen karbantartott, különböző nehézségű pályát kínál, amely alkalmas gyermekes családoknak, kezdőknek és haladó síelőknek egyaránt.</p>
                        </div>
                    </div>
                    <div className={"info-main-wrapper"}>
                        <div className={"info-main-column"}>
                            <div className={"info-main-square"}>
                                <img className={"info-square-img"} src={felvono1}/>
                                <div className={"image_overlay"}>
                                    <p className={"image_description"}>Tányéros felvonók</p>
                                </div>
                            </div>
                            <p>
                                3 tányéros felvonó:
                                <ul>
                                    <li>Junior pálya - 230m </li>
                                    <li>Könnyü pálya - 645m</li>
                                    <li>Közép-nehézségű pálya - 1490m</li>
                                </ul>
                            </p>
                        </div>
                        <div className={"info-main-column"}>
                            <div className={"info-main-square"}>
                                <img className={"info-square-img"} src={felvono2}/>
                                <div className={"image_overlay"}>
                                    <p className={"image_description"}>Ülőliftek</p>
                                </div>
                            </div>
                            <p>
                                2 ülőlift:
                                <ul>
                                    <li>Közép-nehézségű pálya - 1960m (4 személyes)</li>
                                    <li>Igényes pálya - 2460m (6 személyes)</li>
                                </ul>
                            </p>
                        </div>
                        <div className={"info-main-column"}>
                            <div className={"info-main-square"}>
                                <img className={"img-square-split"} src={felvono2}/><img className={"img-square-split clip"} src={felvono1}/>
                                <div className={"image_overlay"}>
                                    <p className={"image_description"}>Összes felvonó</p>
                                </div>
                            </div>
                            <p>
                                Tányéros felvonók és ülőliftek:
                                <ul>
                                    <li>3 tányéros felvonó</li>
                                    <li>2 ülőlift</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                    <div className={"info-table-wrapper"}>
                        <h2 className={"text-bold"}>Felvonók üzemeltetése</h2>
                    <table className={"table info-table"}>
                        <thead>
                            <tr>
                                <th>Nap</th>
                                <th>Nyitás</th>
                                <th>Záras</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Hetfő</td>
                            <td>9:00</td>
                            <td>16:00</td>
                        </tr>
                        <tr>
                            <td>Kedd</td>
                            <td>9:00</td>
                            <td>16:00</td>
                        </tr>
                        <tr>
                            <td>Szerda</td>
                            <td>9:00</td>
                            <td>16:00</td>
                        </tr>
                        <tr>
                            <td>Csütörtök</td>
                            <td>9:00</td>
                            <td>16:00</td>
                        </tr>
                        <tr>
                            <td>Péntek</td>
                            <td>9:00</td>
                            <td>17:00</td>
                        </tr>
                        <tr>
                            <td>Szombat</td>
                            <td>9:00</td>
                            <td>17:00</td>
                        </tr>
                        <tr>
                            <td>Vasárnap</td>
                            <td>9:00</td>
                            <td>17:00</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </Container>
            </div>
            <div className={"info-rent"}>
                <Container>
                    <div className={"info-rent-wrapper"}>
                        <h2 className={"info-rent-head"}>Kölcsönzés es javítás</h2>
                        <p className={"info-rent-para"}>Sífelszerelés javítása és kölcsönzése akár online foglalással is.</p>
                        <Button className={"btn-rent"} onClick={navKolcson}>Kölcsönző</Button>
                    </div>
                </Container>
            </div>
        </div>
    )
}
export default InfoScreen;