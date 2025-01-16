const Errors =({errors})=>{
    if(!errors){
        return null
    }
    return(
        <ul className="error-message">
            <li>{errors}</li>
        </ul>
    )
}
export default Errors