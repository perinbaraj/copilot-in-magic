// Fetch trending GitHub repositories

const axios = require('axios');
const config = require('./config');

class RepoFetcher {
  constructor() {
    this.client = axios.create({
      baseURL: config.github.baseUrl,
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN || ''}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
  }

  async fetchTrendingRepos() {
    try {
      console.log(`📥 Fetching ${config.maxProjects} trending GitHub repositories...`);

      const response = await this.client.get('/search/repositories', {
        params: {
          q: config.search.q,
          per_page: config.search.per_page,
          sort: config.search.sort,
          order: config.search.order,
        },
      });

      const repos = response.data.items
        .slice(0, config.maxProjects)
        .map(repo => ({
          name: repo.name,
          owner: repo.owner.login,
          url: repo.clone_url,
          htmlUrl: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          description: repo.description,
        }));

      console.log(`✓ Fetched ${repos.length} repositories\n`);
      return repos;
    } catch (error) {
      console.error('✗ Error fetching repositories:', error.message);
      return [];
    }
  }

  async filterRepos(repos) {
    // Filter to repos with languages we support
    return repos.filter(repo => 
      !repo.language || 
      config.languages.includes(repo.language)
    ).slice(0, config.maxProjects);
  }
}

module.exports = RepoFetcher;
