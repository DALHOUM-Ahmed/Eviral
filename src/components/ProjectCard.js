import React, {useState} from 'react';
import { Link, Route, useRouteMatch } from 'react-router-dom';
import Bookmark from './Bookmark';
import Rating from './Rating';

/*
For project pages add description, for address to rank/review and then average that rating, links to project socials/github/website,
request collaboration
*/


function ProjectCard(props) {
    const { url } = useRouteMatch();

    return (
        <>
            <div className="card-container">                
                    <Link className="cards-link" to={`${url}/${props.path}`}>
                        <figure className='card-pic-wrap' category={props.label}>
                            <img className="project-img" src={props.src}></img>
                        </figure>
                    </Link>
                    <div className="card-body">
                        <div>
                            <h4>{props.title}</h4>
                        </div>
                        <div className="project-creator">
                           <img  src={props.creatorProfilePic}  className="creator-profile-pic"/>{" "}{props.username}{"   -   "}{props.createdOn}
                        </div>
                        <div className="project-summary">
                            {props.summary}
                        </div>
                    </div>
                    <div className="hl"></div>
                    <div className="card-footer">
                        <Rating          
                        />
                        <Bookmark 
                        projectTitle = {props.projectTitle}  
                        />
                    </div>
               
            </div>
            
        </>
    )
}

export default ProjectCard;