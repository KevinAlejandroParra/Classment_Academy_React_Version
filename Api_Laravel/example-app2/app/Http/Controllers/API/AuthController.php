<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;


  class AuthController extends BaseController
{
     /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */

     //registro
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'usuario_documento' => 'required|string|max:20',
            'usuario_tipo_documento' => 'required|in:CC,CE,TI,PPN,NIT,SSN,EIN',
            'usuario_nombre' => 'required|string|max:100',
            'usuario_apellido' => 'required|string|max:100',
            'usuario_correo' => 'required|email|max:100',
            'usuario_password' => 'required|string|min:6|max:100',
            'rol' => 'required|in:Estudiante, Admin_Escuela, Developer',
            'usuario_telefono' => 'nullable|string|max:20',
            'usuario_direccion' => 'nullable|string',
            'usuario_nacimiento' => 'required|date',
            'usuario_imagen_url' => 'nullable|string|max:255',
            'usuario_fecha_creacion' => 'nullable|date',
            'usuario_ultima_actualizacion' => 'nullable|date',
            'usuario_estado' => 'nullable|in:activo,inactivo',
        ]);
             if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
             $input = $request->all();
             $input['usuario_password'] = bcrypt($input['usuario_password']);
             $user = User::create($input);
             $success['user'] =  $user;
             
             return $this->sendResponse($success, 'Registro Exitoso.');

           
    }
        /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
     
     public function login(Request $request)
     {
         $validator = Validator::make($request->all(), [
             'usuario_correo' => 'required|email',
             'usuario_password' => 'required|string|min:8',
         ]);
     
         if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
         }
     
         // Verificar autenticación
         if (!$token = JWTAuth::attempt
         (['usuario_correo' => $request->usuario_correo, 
         'password' => $request->usuario_password])) 
         
         {   
            return response()->json(['error' => 'No autorizado'], 401);
         }
     
         return [
             'access_token' => $token,
             'token_type' => 'bearer',
             'expires_in' => auth()->factory()->getTTL() * 60
         ];
     }
     
      /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    //obtener perfil
    public function profile()
{
    $user = auth()->user();

    if (!$user) {
        return $this->sendError('Usuario no encontrado.', [], 404);
    }

    $success['user'] = $user;

    if ($user->rol === 'Admin_Escuela') {
        $escuela = \App\Models\Escuelas::where('escuela_correo', $user->usuario_correo)->first();
        $success['escuelas'] = $escuela;
    }

    return $this->sendResponse($success, 'Perfil obtenido con éxito.');
}

      /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */

     //cerrar sesión
    public function logout()
    {
        auth()->logout();
         return $this->sendResponse([], 'Sesión cerrada con exito.');
    }  
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */

     //Refrescar token
    public function refresh()
    {
        $success = $this->respondWithToken(auth()->refresh());
           return $this->sendResponse($success, 'Token refrescado con exito');
    }
      /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */

     //Funcion para obtener el token
     protected function respondWithToken($token)
     {
         return response()->json([
             'success' => true,
             'data' => [
                 'access_token' => $token,
                 'token_type' => 'bearer',
                 'expires_in' => auth()->factory()->getTTL() * 60
             ],
             'message' => 'Inicio de sesión exitoso.'
         ]);
     }
     
    
    //Actualizar perfil
    public function updateProfile(Request $request)
    {
        try {
            $usuario = auth()->user();

            if (!$usuario) {
                return response()->json([
                    'message' => 'Usuario no encontrado.'
                ], 404);
            }

            $validatedData = $request->validate([
                'usuario_nombre' => 'string|max:100',
                'usuario_apellido' => 'string|max:100',
                'usuario_correo' => 'string|email|max:100|unique:usuarios,usuario_correo,' . $usuario->usuario_documento . ',usuario_documento',
                'usuario_password' => 'string|min:6',
                'usuario_telefono' => 'string|max:20|nullable',
                'usuario_direccion' => 'string|nullable',
                'usuario_nacimiento' => 'date',
                'usuario_estado' => 'in:activo,inactivo',

                //Actualizar los datos de la escuela
                'escuela_nombre' => 'String|max:100|nullable',
                'escuela_direccion' => 'String|max:100|nullable',
                'escuela_telefono' => 'String|max:20|nullable',
                'escuela_correo' => 'String|email|max:100|nullable',
                'escuela_imagen_url' => 'String|nillable',
            ]);

            $usuario->fill($request->only([
                'usuario_nombre',
                'usuario_apellido',
                'usuario_correo',
                'usuario_telefono',
                'usuario_direccion',
                'usuario_nacimiento',
                'usuario_estado'
            ]));

            if ($request->has('usuario_password')) {
                $usuario->usuario_password = bcrypt($request->usuario_password);
            }

            $usuario->save();

            //Actualizar los datos de la escuela
            if($usuario->rol === 'Admin_Escuela' && $usuario->escuelas) {
                $usuario->escuelas->update($request->only([
                    'escuela_nombre',
                    'escuela_direccion',
                    'escuela_telefono',
                    'escuela_correo',
                    'escuela_imagen_url'
                ]));
            }

            return response()->json([
                'message' => 'Usuario actualizado exitosamente.',
                'usuario' => $usuario
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error al actualizar el usuario.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    //Eliminar perfil
    public function deleteProfile()
{
    try {
      
      $usuario = auth()->user();

        if (!$usuario) {
           
            return response()->json([
                'message' => 'Usuario no encontrado.'
            ], 404);
        }

        //eliminar datos escuela

        if($usuario->rol === 'Admin_Escuela') {
            $usuario->escuelas()->delete();
        }
        $usuario->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente.'
        ], 200);

    } catch (\Exception $e) {
        
        return response()->json([
            'message' => 'Ocurrió un error al eliminar el usuario.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}