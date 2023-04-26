function Snow(props){
    const {avgheight} = props;
    return(
            <div className={'snow'}>
                <h3>
                    <i className={'fas fa-ruler-vertical'}></i> {" " + avgheight + " cm " }
                </h3>
            </div>
    )
}

export default Snow;
