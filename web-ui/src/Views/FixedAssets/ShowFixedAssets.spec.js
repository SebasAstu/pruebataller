import {render, screen, waitFor} from '@testing-library/react';
import {ShowFixedAsset} from './ShowOneFixedAsset';

import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {act} from 'react-dom/test-utils';

import {MemoryRouter, Route, Routes} from 'react-router-dom'
import ShowFixedAssets from './ShowFixedAssets';

describe('Show Fixed Asset', () => {
  const fixedAssetUrl ='https://ncv-api.herokuapp.com/api/fixedAssets'  

  function getResponse(url, jsonData=null, code=200, text=null){
    const response = rest.get(url, (req, res, ctx) => {
      if(code!=200) return res(ctx.status(code), ctx.text(text))
      return res(ctx.json(jsonData))
    })
    return response
  }

  const fixedAssets =
  [
    {
       "id":1,
       "name":"Asset name 1",
       "description":"Description from asset 1",
       "entryDate":"2022-10-16T20:00:00",
       "price":100.58,
       "features":"8Gb de RAM",
       "quantity":5
    },
    {
       "id":2,
       "name":"Asset name 2",
       "description":"Description from asset 2",
       "entryDate":"2020-11-12T20:00:00",
       "price":100.58,
       "features":"8Gb de RAM",
       "quantity":5
    },
    {
       "id":3,
       "name":"Asset name 3",
       "description":"Description from asset 3",
       "entryDate":"2022-09-11T00:00:00",
       "price":1000,
       "features":"8 GB de ram",
       "quantity":1
    },
    {
       "id":4,
       "name":"Asset name 4",
       "description":"Description from asset 4",
       "entryDate":"2022-09-11T00:00:00",
       "price":200,
       "features":"Tiene un rayon",
       "quantity":1
    },
    {
       "id":5,
       "name":"Asset name 5",
       "description":"Description from asset 5",
       "entryDate":"2022-09-11T00:00:00",
       "price":100,
       "features":"Tiene RGB",
       "quantity":1
    }
  ]

  const fixedAssetsOnlyRequiredFields =
  [
    {
       "id":1,
       "name":"Asset name 1",
       "description":null,
       "entryDate":null,
       "price":100,
       "features":null,
       "quantity":1
    },
    {
       "id":2,
       "name":"Asset name 2",
       "description":null,
       "entryDate":null,
       "price":100,
       "features":null,
       "quantity":1
    },
    {
       "id":3,
       "name":"Asset name 3",
       "description":null,
       "entryDate":null,
       "price":100,
       "features":null,
       "quantity":1
    },
    {
       "id":4,
       "name":"Asset name 4",
       "description":null,
       "entryDate":null,
       "price":100,
       "features":null,
       "quantity":1
    },
    {
       "id":5,
       "name":"Asset name 5",
       "description":null,
       "entryDate":null,
       "price":100,
       "features":null,
       "quantity":1
    }
  ]

	const fixedAssetResponse = getResponse(fixedAssetUrl, fixedAssets)

  const handlers = [fixedAssetResponse];

  const server = new setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  function renderWithRouter(componentToRender, pathToElement, mockedPath){
    render( 
      <MemoryRouter initialEntries={[mockedPath]}>
          <Routes>
              <Route path={pathToElement} element={componentToRender}></Route>
          </Routes>
      </MemoryRouter>
    )
  }

  it('Shows a list of fixed assets data correctly', async () => {
    act(()=>{
      renderWithRouter(<ShowFixedAssets/>,"/activos-fijos","/activos-fijos" )
    }) 
    await waitFor(() => {
        expect(screen.getByText('Lista de activos fijos')).toBeVisible
        expect(screen.getByText('Crear activo fijo')).toBeVisible
        expect(screen.getByText('Asset name 1')).toBeVisible
        expect(screen.getByText('Descripción: Description from asset 1')).toBeVisible
        expect(screen.getByText('Asset name 2')).toBeVisible
        expect(screen.getByText('Descripción: Description from asset 2')).toBeVisible
        expect(screen.getByText('Asset name 3')).toBeVisible
        expect(screen.getByText('Descripción: Description from asset 3')).toBeVisible
        expect(screen.getByText('Asset name 4')).toBeVisible
        expect(screen.getByText('Descripción: Description from asset 4')).toBeVisible
        expect(screen.getByText('Asset name 5')).toBeVisible
        expect(screen.getByText('Descripción: Description from asset 5')).toBeVisible
      })  
  })
  
  it('Shows fixed assets data when non-required fields are null', async () => {    
    const fixedAssestWithOnlyRequiredFields = getResponse(fixedAssetUrl, fixedAssetsOnlyRequiredFields)
    server.use(fixedAssestWithOnlyRequiredFields)
    act(()=>{
      renderWithRouter(<ShowFixedAssets/>,"/activos-fijos","/activos-fijos" )
    }) 
    await waitFor(() => {
      expect(screen.getByText('Asset name 1')).toBeVisible
      expect(screen.getByText('Asset name 2')).toBeVisible
      expect(screen.getByText('Asset name 3')).toBeVisible
      expect(screen.getByText('Asset name 4')).toBeVisible
      expect(screen.getByText('Asset name 5')).toBeVisible
      expect(screen.getAllByText('Descripción: *Sin descripción*')).toHaveLength(5)
      })  
  })
  it('Shows error when api does not return any data. Should return error 500', async () => {
    const fixedAssetInternalServiceErrorResponse = getResponse(fixedAssetUrl, null, 500, "Lo sentimos, algo sucedió.")
    server.use(fixedAssetInternalServiceErrorResponse)
    act(()=>{
      renderWithRouter(<ShowFixedAssets/>,"/activos-fijos","/activos-fijos" )
    }) 
    await waitFor(() => {
        expect(screen.getByText("ERROR 500: Lo sentimos, algo sucedió.").toBeVisible)
      })  
  });
})