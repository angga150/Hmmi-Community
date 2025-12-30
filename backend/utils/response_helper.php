<?php
function successResponse($data = null, $message = 'Success', $code = 200) {
    http_response_code($code);
    return json_encode([
        'success' => true,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

function errorResponse($message = 'Error', $code = 400, $errors = null) {
    http_response_code($code);
    $response = [
        'success' => false,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($errors) {
        $response['errors'] = $errors;
    }
    
    return json_encode($response);
}

function validationError($errors) {
    return errorResponse('Validation error', 422, $errors);
}

function notFoundResponse($message = 'Resource not found') {
    return errorResponse($message, 404);
}

function unauthorizedResponse($message = 'Unauthorized') {
    return errorResponse($message, 401);
}

function forbiddenResponse($message = 'Forbidden') {
    return errorResponse($message, 403);
}
?>