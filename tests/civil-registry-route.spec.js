const {
    test,
    expect
} = require('@playwright/test');

test('should not find a person', async ({
    request
}) => {
    const person = await request.post('/api/routes/civil-registry/run', {
        data: {
            id: '328802792660011'
        }
    });
    expect(person.status()).toBe(404);
});


test('should find a person', async ({
    request
}) => {
    const person = await request.post('/api/routes/civil-registry/run', {
        data: {
            id: '328808792660010'
        }
    });
    expect(person.status()).toBe(200);
});