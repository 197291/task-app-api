
class HomeContoller {
  async initHomePage(ctx, next) {
    console.log(ctx.request);
    const pokemons = await ctx.get('https://api.pokemontcg.io/v1/cards');
    ctx.response.body = {
      pokemons
    };
    await next(); 
  }
}

module.exports = new HomeContoller();