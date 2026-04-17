/**
 * Script de prueba de concurrencia para ICESI Interactiva
 * Simula múltiples peticiones simultáneas para verificar que el pool de conexiones funcione correctamente.
 */

async function runTest() {
  const TOTAL_REQUESTS = 50; // Número de peticiones simultáneas
  const URL = process.argv[2] || 'http://localhost:3000/api/auth/me';

  console.log(`🚀 Iniciando prueba de estrés: ${TOTAL_REQUESTS} peticiones a ${URL}`);
  
  const startTime = Date.now();
  const requests = Array.from({ length: TOTAL_REQUESTS }).map((_, i) => 
    fetch(URL)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Status ${res.status}: ${body.substring(0, 100)}`);
        }
        return { id: i, status: res.status };
      })
      .catch(err => ({ id: i, error: err.message }))
  );

  const results = await Promise.all(requests);
  const endTime = Date.now();

  const success = results.filter(r => r.status === 200).length;
  const errors = results.filter(r => r.error).length;

  console.log('\n--- 📊 Resultados de la prueba ---');
  console.log(`✅ Peticiones exitosas: ${success}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`⏱️ Tiempo total: ${endTime - startTime}ms`);

  if (errors > 0) {
    console.log('\n❌ Errores encontrados:');
    results.filter(r => r.error).slice(0, 5).forEach(r => console.log(`   - ${r.error}`));
    console.log('\nSi ves "Too many clients", la base de datos sigue saturándose.');
  } else {
    console.log('\n✨ ¡Éxito! El servidor manejó todas las peticiones correctamente sin agotar las conexiones.');
  }
}

runTest();
