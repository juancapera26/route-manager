from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

# ================= CONFIGURACIÓN DEL DRIVER =================
def setup_driver():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    return driver

# Login
def login(driver, email="prueba2@gmail.com", password="12345678"):
    driver.get("http://localhost:5174/signin")

    driver.find_element(By.NAME, "email").send_keys(email)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.XPATH, "//button[contains(text(),'Iniciar sesión')]").click()

    # Espera hasta que aparezca el header (indicador de login exitoso)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "header"))
    )
    

# Prueba 1
def test_login_correcto_incorrecto():
    driver = setup_driver()
    try:
        driver.get("http://localhost:5174/signin")


        driver.find_element(By.NAME, "email").send_keys("prueba_falsa@gmail.com")
        driver.find_element(By.NAME, "password").send_keys("clave_invalida")
        driver.find_element(By.XPATH, "//button[contains(text(),'Iniciar sesión')]").click()
        time.sleep(2)
        driver.save_screenshot("login_incorrecto.png")
        print("\nPrueba 1.1: login con datos incorrectos \n")


        driver.find_element(By.NAME, "email").clear()
        driver.find_element(By.NAME, "password").clear()
        driver.find_element(By.NAME, "email").send_keys("prueba2@gmail.com")
        driver.find_element(By.NAME, "password").send_keys("12345678")
        driver.find_element(By.XPATH, "//button[contains(text(),'Iniciar sesión')]").click()

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "header"))
        )
        driver.save_screenshot("login_correcto.png")
        print("prueba 1.2: Login con datos correctos \n==============================================")

    finally:
        driver.quit()

# Prueba 2
def test_home_admin():
    driver = setup_driver()
    try:
        login(driver)
        driver.get("http://localhost:5174/admin")

        time.sleep(10)

        driver.save_screenshot("dashboard_admin.png")
        print("\nprueba 2: Captura de una pantalla completa \n==============================================")

    finally:
        driver.quit()


# prueba 3
def test_espera_elementos():
    driver = setup_driver()
    try:
        login(driver) 
        driver.get("http://localhost:5174/admin/packages-management")

        elementos = [
            (By.TAG_NAME, "header"),
            (By.TAG_NAME, "aside"),
            (By.XPATH, "//h1[contains(text(),'Gestión de Paquetes')]"),
            (By.TAG_NAME, "table"),
            (By.CSS_SELECTOR, "button.bg-success-700"),
            (By.XPATH, "//div[contains(@class,'flex')]")
        ]

        for i, localizador in enumerate(elementos, start=1):
            WebDriverWait(driver, 10).until(EC.presence_of_element_located(localizador))
            print(f"Elemento {i} cargó correctamente: {localizador}")

        driver.save_screenshot("espera_6_elementos.png")
        print("\nCaptura de los 6 elementos tomada \n==============================================")

    finally:
        driver.quit()



if __name__ == "__main__":
    print("\n=== Actividad final - pruebas con selenium y papi python ===\n")
    test_login_correcto_incorrecto()
    test_home_admin()
    test_espera_elementos()
    print("\nTodas las pruebas completadas \n==============================================")
