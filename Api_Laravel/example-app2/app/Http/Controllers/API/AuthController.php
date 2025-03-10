<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
  class AuthController extends BaseController
{
     /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'usuario_documento' => 'required|string|max:20',
            'usuario_tipo_documento' => 'required|in:CC,CE,TI,PPN,NIT,SSN,EIN',
            'usuario_nombre' => 'required|string|max:100',
            'usuario_apellido' => 'required|string|max:100',
            'usuario_correo' => 'required|email|max:100',
            'usuario_password' => 'required|string|min:6|max:100',
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
        
        if($validator->fails()){
        return $this->sendError('Error al Iniciar sesión.', $validator->errors());
    }
        $credentials = [
            'usuario_correo' => $request->usuario_correo,
            'password' => $request->usuario_password
        ];
            
        if (! $token = auth()->attempt($credentials)) {
            return $this->sendError('Unauthorised.', ['error' => 'Error al Iniciar sesión']);
        }
            
        $success = $this->respondWithToken($token);
        return $this->sendResponse($success, 'Inicio de sesión Exitoso.');
    }
      /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        $success = auth()->user();
           return $this->sendResponse($success, 'retorno exitoso');
    }
      /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
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
    protected function respondWithToken($token)
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    } 

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
                'usuario_estado' => 'in:activo,inactivo'
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

    public function deleteProfile()
{
    try {
      
      $usuario = auth()->user();

        if (!$usuario) {
           
            return response()->json([
                'message' => 'Usuario no encontrado.'
            ], 404);
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