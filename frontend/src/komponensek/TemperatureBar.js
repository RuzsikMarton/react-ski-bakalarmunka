import React from "react";

function TemperatureBar(props) {
    const {value, mintemp, maxtemp, minheight, maxheight} = props;
    const percentage = ((value - -15) / (15 - -15)) * 100;
    let fill = '#00bfff';

    if (value < -12) {
        fill = 'linear-gradient(to right, #376fc1, #3780c1)';
    } else if (value >= -12 && value < -10) {
        fill = 'linear-gradient(to right, #376fc1 25%, #3780c1 50% , #3797c1 100%)';
    } else if (value >= -10 && value < -6) {
        fill = 'linear-gradient(to right, #376fc1 25%, #3780c1 50% , #3797c1 75% , #37b4c1 100%)';
    } else if (value >= -6 && value < -1) {
        fill = 'linear-gradient(to right, #376fc1 20%, #3780c1 40% , #3797c1 60% , #37b4c1 80%, #37c1a6 100%)';
    } else if (value >= -1 && value < 2) {
        fill = 'linear-gradient(to right, #376fc1 15%, #3780c1 25% , #3797c1 45% , #37b4c1 60%, #37c1a6 80%, #37c165 100%)';
    } else if (value >= 2 && value < 5) {
        fill = 'linear-gradient(to right, #376fc1 15%, #3780c1 25% , #3797c1 40% , #37b4c1 55%, #37c1a6 70%, #37c165 85%, #6dc137 100%)';
    } else if (value >= 5 && value < 10) {
        fill = 'linear-gradient(to right, #376fc1 10%, #3780c1 20% , #3797c1 35% , #37b4c1 50%, #37c1a6 60%, #37c165 75%, #6dc137 90%, #99c137 100%)';
    } else if (value >= 10 && value < 14) {
        fill = 'linear-gradient(to right, #376fc1 10%, #3780c1 20% , #3797c1 30% , #37b4c1 40%, #37c1a6 50%, #37c165 60%, #6dc137 70%, #99c137 80%, #c1bf37 100%)';
    } else {
        fill = 'linear-gradient(to right, #376fc1 10%, #3780c1 20% , #3797c1 30% , #37b4c1 40%, #37c1a6 50%, #37c165 60%, #6dc137 70%, #99c137 80%, #c1bf37 90%, #c17237 100%)';
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#36454F' }}> Várható átlag hőmérséklet: {value}°C</p>
            <div style={{ position: 'relative', width: '250px', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ position: 'absolute', top: '0', left: '0', width: `${percentage}%`, height: '100%', background: fill, borderRadius: '10px' }} />
            </div>
            <div className={'snow mt-3'}>
                <h5>
                    <i className={'fas fa-temperature-low'}></i><span>&nbsp;{"MIN-MAX HŐMÉRSÉKLET: "}</span> <span style={{color: "#6082C6" , fontWeight: "bold"}}>{mintemp +"°C " + " -  "+ maxtemp +"°C " }</span>
                </h5>
                <h5>
                    <i className={'fas fa-ruler-vertical'}></i> <span>&nbsp;&nbsp;{"HÓ MAGASSÁG: "}</span><span style={{color: "#6082C6" , fontWeight: "bold"}}>{minheight + " - "+ maxheight +" CM " }</span>
                </h5>
            </div>
        </div>
    );
}
export default TemperatureBar;