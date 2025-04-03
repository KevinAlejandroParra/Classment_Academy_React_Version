<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Escuelas;
use Illuminate\Support\Facades\Validator;


class EscuelasController extends Controller
{

    public function index()
    {
        $escuelas = Escuelas::all();
        return response()->json($escuelas);
    }

    //Agregar nueva escuela
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'escuela_id' => 'required|String|max:20|unique:escuelas',
            'escuela_nombre' => 'required|String|max:100',
            'escuela_nit' => 'required|String|unique:escuelas',
            'escuela_descripcion' => 'nullable|String',
            'escuela_telefono' => 'nullable|String|max20',
            'escuela_direccion' => 'rquired|String',
            'escuela_correo' => 'required|email|unique:escuelas', 
            'escuela_imagen_url' => 'nullable|String',
            'escuela_estado' => 'in:Activo,Inactivo',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $escuelas = Escuelas::create([
            'escuela_id' => $request->escuela_id,
            'escuela_nombre' => $request->escuela_nombre,
            'escuela_nit' => $request->escuela_nit,
            'escuela_descripcion' => $request->escuela_descripcion,
            'escuela_telefono' => $request->escuela_telefono,
            'escuela_direccion' => $request->escuela_direccion,
            'escuela_correo' => $request->escuela_correo,
            'escuela_imagen_url' => $request->escuela_imagen_url ?? '../../PUBLIC/Img/escuelas/nf.jpg',
            'escuela_estado' => $request->escuela_estado ?? 'activo',
        ]);

        return response()->json($escuelas, 201);

    }

    //Encontrar la escuela por id

    public function show(string $id)
    {
        $escuela = Escuelas::find($id);

        if(!$escuela){
            return response()->json(['message' => 'No se ha podido encontrar la escuela'], 404);
        }
        return response()->json($escuela, 200);
    }

    //Actualizar la escuela
    public function update(Request $request, string $id)
    {
        $escuela = Escuelas::find($id);
        if(!$escuela){
            return response()->json(['message' => 'No se ha podido encontrar la escuela'], 404);
        }
        //validar los datos
        $validator = Validator::make($request->all(), [
            
            'escuela_nombre' => 'sometimes|String|max:100',
            'escuela_nit' => 'sometimes|String|unique:escuelas,escuela_nit,'.$id, 'escuela_id',
            'escuela_descripcion' => 'nullable|String',
            'escuela_telefono' => 'nullable|String|max20',
            'escuela_direccion' => 'sometimes|String',
            'escuela_correo' => 'sometimes|email|unique:escuelas,escuela_correo,'.$id, 'escuela_id', 
            'escuela_imagen_url' => 'nullable|String',
            'escuela_estado' => 'in:Activo,Inactivo',
        ]);

        if ($validator->fails()){
            return response()->json($validator->errors(), 422);
        }

        //Actualizar los datos

        $escuela->update([
            'escuela_nombre' => $request->escuela_nombre ?? $escuela->escuela_nombre,
            'escuela_nit' => $request->escuela_nit ?? $escuela->escuela_nit,
            'escuela_descripcion' => $request->escuela_descripcion ?? $escuela->escuela_descripcion,
            'escuela_telefono' => $request->escuela_telefono ?? $escuela->escuela_telefono,
            'escuela_direccion' => $request->escuela_direccion ?? $escuela->escuela_direccion,
            'escuela_correo' => $request->escuela_correo ?? $escuela->escuela_correo,
            'escuela_imagen_url' => $request->escuela_imagen_url ?? $escuela->escuela_imagen_url,
            'escuela_estado' => $request->escuela_estado ?? $escuela->escuela_estado,
        ]);
        return response()->json($escuela, 200);
    }

    //Eliminar escuela
    public function destroy(string $id)
    {
        $escuela = Escuelas::find($id);

        if(!$escuela){
            return response()->json(['message' => 'No se ha podido encontrar la escuela'], 404);
        }
        return response()->json(['message' => 'Escuela Eliminada exitosamente'], 200);
    }
}
