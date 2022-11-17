import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import ErrorPage from '../../Components/ErrorPage'
import FormContainer from '../../Components/FormContainer'
import InputText from '../../Components/InputText'
import Navbar from '../../Components/NavBar'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import ButtonPrimary from '../../Components/MUI-Button'
import getFromApi from '../../Components/GetFromApi'
import Dropdown from '../../Components/Dropdown'
import axios from 'axios';
import {getFixedAssets} from '../../Components/GetFromApi'

export default function UpdateFixedAssetForm(props) {
    const { fixedAssetId } = useParams()
    const url = `https://ncv-api.herokuapp.com/api/fixedAssets/${fixedAssetId}`
    const urlProgramHouses = 'https://ncv-api.herokuapp.com/api/programHouses'
    const urlCategories = 'https://ncv-api.herokuapp.com/api/assetCategories'
    const urlStates = 'https://ncv-api.herokuapp.com/api/assetStates'
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null)
    const [formErrors,setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const assetsCodes = []
    let programCode = ''
    let categoryCode = ''
    const navigate = useNavigate()
    const [data, setData] = useState([])
    
    //programHouses
    const [programHouseSelectedValue, setProgramHouseSelectedValue] = useState(null)
    const { apiData:programHouses, error:errorProgramHouses } = getFromApi(urlProgramHouses)
    // program Houses Options for DROPDOWN
    if(errorProgramHouses){
        return ErrorPage(errorProgramHouses)
    }
    if (!programHouses) return null
    let programHousesList = programHouses.map( programHouse =>  { return {
        label: programHouse.acronym,
        value: programHouse.id
    }}) 
    const programHousesOptions = programHousesList

    //categories
    const [categorySelectedValue, setCategorySelectedValue] = useState(null)
    const { apiData:categories, error:errorCategory } = getFromApi(urlCategories)
    // categories options for DROPDOWN
    if(errorCategory){
        return ErrorPage(errorCategory)
    }
    if (!categories) return null
    let categoriesList = categories.map( category =>  { return {
        label: category.category,
        value: category.id
    }})
    const categoriesOptions = categoriesList

    //states
    const [stateSelectedValue, setStateSelectedValue] = useState(null)
    const { apiData:states, error:errorStates } = getFromApi(urlStates)
    //states options for DROPDOWN
    if(errorStates){
        return ErrorPage(errorStates)
    }
    if (!states) return null
    let statesList = states.map( state =>  { return {
        label: state.state,
        value: state.id
    }})
    const stateOptions = statesList

    const fetchBasicData = () => {
        const responseData = axios(url);
        axios.all([responseData]).then(
            axios.spread((...allData) => {
                setData(allData[0].data)
                console.log(allData[0].data)
            }))
    }

    useEffect(()=>{
        // console.log(formErrors)
        fetchBasicData();
        if (Object.keys(formErrors).length === 0 && isSubmit){
        //    console.log(data);
        }
    },[formErrors]);

    function handle(e) {
        const {name, value} = e.target
        setData({
            ...data,
            [name]:value
        })
        setOpen(false)
    }

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }
    
    function checkError(){
        if(error){
            //setOpen(true)
            return ErrorPage(error)
        }
    }
    function hasFormErrors(errorsFromForm){
        console.log('form errors',errorsFromForm)
        let hasErrors=true
        if(!errorsFromForm.name && !errorsFromForm.description && !errorsFromForm.price && !errorsFromForm.quantity && !errorsFromForm.programHouseId && !errorsFromForm.assetCategoryId && !errorsFromForm.features){
            hasErrors = false
        }
        return hasErrors
    }
    function submit() {
        const errorsFromForm= validate(data);
        setFormErrors(errorsFromForm)
        setIsSubmit(true)
        //console.log(formErrors)
        //debugger;
        if(!hasFormErrors(errorsFromForm)){
            axios.put(url, data).then((res) => {
                if (res.status == 201) {               
                    navigate(`/activos-fijos`,{state:{showAlert:true,alertMessage:"Activo Fijo actualizado exitosamente"}})
                }            
            }).catch ((apiError) => {
                setError(apiError) 
                checkError()                    
            })
        }
    }

    const validate = (datas) => {        
        const errors = {
            name: '', // string
            description: '', // string
            entryDate: '', // dateTime
            price: '', // decimal
            features: '', // string
            quantity: '', // int
            programHouseId : '', //int
            assetCategoryId : '' //int
        }
        const regexNumber = /^[0-9]+([.][0-9]+)?$/;
        //debugger
        if(!datas.name){
            errors.name="El Nombre del Activo Fijo es requerido!";
        }else if(datas.name.length>60){
            errors.name="El campo Nombre del Activo Fijo debe ser menor o igual a 60 caracteres!";
        }
    
        if(datas.description.length>1000){
            errors.description="El campo Descripción del Activo Fijo debe ser menor o igual a 1000 caracteres!";
        }
    
        if(!datas.price){
            errors.price= "El Precio del Activo Fijo es requerido!";
        }else if(datas.price < 0){
            errors.price= "El Precio del Activo Fijo debe ser un número positivo!";
        }else if(!regexNumber.test(datas.price)){
            errors.price= "El Precio del Activo Fijo debe ser ingresado en formato decimal!";
        }
    
        if(!datas.quantity){
            errors.quantity= "La Cantidad del Activo Fijo es requerida!";
        }

        if(!programHouseSelectedValue){
            errors.programHouseId= "El programa del Activo Fijo es requerido!";
        }

        if(!categorySelectedValue){
            errors.assetCategoryId= "La categoría del Activo Fijo es requerida!";
        }
    
        if(datas.features.length>1000){
            errors.Features= "El campo de Características del Activo Fijo debe ser menor o igual a 1000 caracteres!";
        }
        console.log('errs',errors)
        return errors
    }
    

    if(error){
        //setOpen(true)
        return ErrorPage(error)
    }
    return (
        <><Navbar /><Box sx={{ display: 'flex', justifyContent: 'center' , marginTop:'15vh'}}>
        </Box>
        <div style={{display:'flex', justifyContent:'center'}}>
            <FormContainer title="Editar activo fijo">
                <InputText
                    required
                    id="Name"
                    name="Name"
                    value={data.name}
                    label="Nombre"
                    type="text"
                    onChange={(e) => handle(e)}
                />
                {formErrors.name? <Alert  sx={{ width: 1, pt: 1 }} severity="error"> 
                    {formErrors.name}                   
                </Alert>:<p></p> }
                <Dropdown 
                    name={"Categoría"} 
                    id="category-drop" 
                    options={categoriesOptions} 
                    helperText = "Seleccione una categoría" 
                    selectedValue={categorySelectedValue}
                    setSelectedValue = {setCategorySelectedValue}
                    required
                    >                                        
                </Dropdown> 
                {formErrors.assetCategoryId? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.assetCategoryId}  </Alert>:<p></p> }             
                <InputText
                    onChange={(e) => handle(e)}
                    id="Description"
                    value={data.description}
                    label="Descripción"
                    type="text"
                />
                {formErrors.description? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.description} </Alert>:<p></p> }
                <InputText
                    onChange={(e) => handle(e)}
                    id="EntryDate"
                    value={data.entryDate}
                    label="Fecha de Entrada"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <InputText
                    required
                    id="Price"
                    value={data.price}
                    label="Precio"
                    type="number"
                    onChange={(e) => handle(e)}
                />
                {formErrors.price? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.price}  </Alert>:<p></p> }
                <Dropdown 
                    name={"Programa"} 
                    id="programa-drop" 
                    options={programHousesOptions} 
                    helperText = "Seleccione un programa" 
                    selectedValue={programHouseSelectedValue}
                    setSelectedValue = {setProgramHouseSelectedValue}
                    required
                    >                                        
                </Dropdown>   
                {formErrors.programHouseId? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.programHouseId}  </Alert>:<p></p> }                 
                
                <InputText
                    onChange={(e) => handle(e)}
                    id="Features"
                    value={data.features}
                    label="Características"
                    type="text"
                />
                 {formErrors.features? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.features} </Alert>:<p></p> }
                <ButtonPrimary label={"Guardar cambios"} id="submit_button" onClick={submit}/>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                </Snackbar>
            </FormContainer>
        </div>
        </>
    )
}