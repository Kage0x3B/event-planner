export const routeMetadata = [
{
        id: "index1",
        routeInstance: new (await import('../../routes/index.js')).default,
        html: `<!DOCTYPE html>
<html lang='en'>
<head>
    <title>Hallo</title>
</head>
<body>

</body>
</html>`
    }]