# 简易静态服务器（PowerShell），在项目根目录运行
# 运行：在本目录执行 `powershell -ExecutionPolicy Bypass -File .\serve.ps1`
$folder = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $folder
$prefix = "http://localhost:8000/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Serving $folder on $prefix (按 Ctrl+C 停止)"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
        $req = $context.Request
        $localPath = $req.Url.AbsolutePath.TrimStart('/')
        if ($localPath -eq '') { $localPath = 'index.html' }
        $path = Join-Path $folder $localPath
        if (Test-Path $path) {
            $bytes = [System.IO.File]::ReadAllBytes($path)
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.OutputStream.Close()
        } else {
            $context.Response.StatusCode = 404
            $context.Response.OutputStream.Close()
        }
    } catch {
        # ignore request errors
    }
}
