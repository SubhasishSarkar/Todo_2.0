import React from 'react'

export default function Keywords(props) {
    const handleClick = (e,key) =>{
        e.stopPropagation();
        props.onKeyRemoved(key);
    }
    return (
        <div className="keyword_container">
            { props.keywords.map((key,index)=>{
                return(
                    <button className="keyword" key={index} onClick={(e)=>{handleClick(e,key)}}>
                        {key}
                    </button>
                )
            })}
        </div>
    )
}
