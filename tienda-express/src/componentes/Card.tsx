import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
}

function Card(props:Props){

  const{children} = props;

  return (
    <div className="card">
      <h1>{children}</h1>
</div>
  )
}

export default Card