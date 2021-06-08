export  const getDataFromLocalStorage = () => {
    return (localStorage.getItem('todoData'))?JSON.parse(localStorage.getItem('todoData')):null;
}
export const setDataToLocalStorage = (appData = null) => {
    localStorage.setItem('todoData',JSON.stringify(appData))
}