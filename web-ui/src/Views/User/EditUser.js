/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/NavBar'
import FormContainer from '../../Components/FormContainer'
import InputText from '../../Components/InputText'
import Collapse from '@mui/material/Collapse'
import MenuItem from '@mui/material/MenuItem'
import ButtonPrimary from '../../Components/MUI-Button'
import Alert from '@mui/material/Alert'

const roles = [
    {
        label: 'Tia',
        value: 'AuntUser'
    },
    {
        label: 'Administrador',
        value: 'AdminUser'
    },
    {
        label: 'Super Usuario',
        value: 'SuperUser'
    }
]

export function EditUser() {
    const navigate = useNavigate()
    const userId = '4cf62dc7-5e67-46fa-a227-f8dae70cba5a'
    var url = 'https://ncv-api.herokuapp.com/api/auth/' + userId
    const [user, setUser] = useState([])
    const [open, setOpen] = useState(false)

    const fetchData = () => {
        var responseUser = axios(url)
        axios.all([responseUser]).then(
            axios.spread((...allData) => {
                var dataUser = allData[0].data
                setUser(dataUser)
            })
        )
    }

    useEffect(() => {
        fetchData()
    }, [])
    console.log('user json: ', user)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setOpen(false)
        setUser({
            ...user,
            [name]: value
        })
    }

    function handleFormSubmit() {}

    return (
        <>
            <Navbar />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '3em'
                }}
            >
                <FormContainer title="Editar usuario">
                    <Collapse in={open} sx={{ width: 1, pt: 2 }}>
                        <Alert severity="error">
                            Todos los campos son requeridos
                        </Alert>
                    </Collapse>

                    <InputText
                        required
                        id="firstName"
                        name="firstName"
                        label="Nombre"
                        type="text"
                        value={user.firstName}
                        onChange={handleInputChange}
                    />
                    <InputText
                        required
                        id="lastName"
                        name="lastName"
                        label="Apellido"
                        type="text"
                        value={user.lastName}
                        onChange={handleInputChange}
                    />
                    <InputText
                        required
                        id="cellPhone"
                        name="cellPhone"
                        label="Celular"
                        type="number"
                        value={user.cellPhone}
                        onChange={handleInputChange}
                    />
                    <InputText
                        required
                        id="email"
                        name="email"
                        label="Correo electronico"
                        type="email"
                        value={user.email}
                        onChange={handleInputChange}
                    />
                    <InputText
                        required
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={user.password}
                        onChange={handleInputChange}
                    />
                    <InputText
                        required
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirmar contraseña"
                        type="password"
                        value={user.confirmPassword}
                        onChange={handleInputChange}
                    />
                    <InputText
                        required
                        select
                        id="rol"
                        name="rol"
                        label="Rol"
                        type="text"
                        value={user.rol}
                        onChange={handleInputChange}
                    >
                        {roles.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </InputText>
                    <ButtonPrimary
                        label={'Editar'}
                        //onClick={handleFormSubmit}
                    />
                </FormContainer>
            </div>
        </>
    )
}

export default EditUser
