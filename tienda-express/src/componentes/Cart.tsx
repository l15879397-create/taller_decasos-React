interface CardBodyProps{
    tittle: string;
    text?: string;
}

function CardBody(props:CardBodyProps){

    const{tittle, text} = props;
    return(
        <div className="card-body">
           <h5 className="card-title">{tittle}</h5>
           <p className="card-text">{text}</p>
           <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
    )
}

export default CardBody