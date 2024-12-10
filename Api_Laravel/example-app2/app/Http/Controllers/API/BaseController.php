<?php
namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller as controller;

class BaseController extends controller {
    public function sendResponse($result,$message)
    {
        $reponse = [
            'success' => true,
            'data' => $result,
            'message' => $message
        ];

        return response()->json($reponse, 200);
    }

    public function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }
}
?>