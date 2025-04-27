package auth

import (
	"os"

	"github.com/gin-gonic/gin"
)

var cookieDomain = os.Getenv("COOKIE_DOMAIN")

func SetCookie(c *gin.Context, name, value, path, domain string, secure, httpOnly bool, maxAge int) {
	c.SetCookie(name, value, maxAge, path, domain, secure, httpOnly)
}

func SetAccessAndRefreshCookies(c *gin.Context, accessToken, refreshToken string) error {
	SetCookie(c, "access_token", accessToken, "/", cookieDomain, true, true, 15*60)
	SetCookie(c, "refresh_token", refreshToken, "/", cookieDomain, true, true, 7*24*60*60)
	return nil
}

func GetCookie(c *gin.Context, name string) (string, error) {
	cookie, err := c.Cookie(name)
	if err != nil {
		return "", err
	}
	return cookie, nil
}

func ClearCookie(c *gin.Context, name string) {
	SetCookie(c, name, "", "/", cookieDomain, true, true, -1)
}
