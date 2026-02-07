export function StatsBanner() {
  const stats = [
    {
      value: '$15M+',
      label: 'Total Raised',
    },
    {
      value: '6',
      label: 'Successful Projects',
    },
    {
      value: '12,500+',
      label: 'Investors Served',
    },
    {
      value: '98%',
      label: 'Success Rate',
    },
  ];

  return (
    <section className="py-12 bg-gray-900 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p
                className="text-3xl sm:text-4xl mb-2 font-maven-pro"
                style={{
                  background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}