from fastapi import HTTPException, status

# Custom HTTP Exceptions
def authentication_error(detail: str = "Authentication failed") -> HTTPException:
    """Authentication failed exception"""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )

def authorization_error(detail: str = "Not enough permissions") -> HTTPException:
    """Authorization failed exception"""
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

def not_found_error(detail: str = "Resource not found") -> HTTPException:
    """Resource not found exception"""
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

def validation_error(detail: str = "Validation failed") -> HTTPException:
    """Validation error exception"""
    return HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

def conflict_error(detail: str = "Resource conflict") -> HTTPException:
    """Resource conflict exception"""
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)
