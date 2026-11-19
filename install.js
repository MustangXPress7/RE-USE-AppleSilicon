module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      // Pinokio's Create App -> Download cannot select a branch, so clone the
      // beta branch explicitly into app/. The real launcher stays in one repo.
      when: "{{!exists('app/pinokio.js')}}",
      method: 'shell.run',
      params: {
        message: 'git clone --depth 1 --branch mac-mlx https://github.com/MustangXPress7/NemotronLabs-RE-USE-Pinokio_Win-Nvidia.git app'
      }
    },
    {
      // app/install.js creates app/.env, downloads the LiteRT graphs and verifies.
      method: 'script.start',
      params: {
        uri: 'app/install.js'
      }
    }
  ]
};
