Write-Host "Iniciando PULSO Backend (Supabase PostgreSQL)..." -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Program Files\Java\zulu17.48.15-ca-fx-jdk17.0.10-win_x64"
$jar = "$PSScriptRoot\target\pulso-backend-1.0.0.jar"

if (Test-Path $jar) {
    Write-Host "Executando JAR otimizado..." -ForegroundColor Green
    & "$env:JAVA_HOME\bin\java.exe" -Xmx256m -XX:MaxMetaspaceSize=128m -jar $jar
} else {
    Write-Host "JAR não encontrado. Compile com: .\mvnw.cmd package -DskipTests" -ForegroundColor Red
}
