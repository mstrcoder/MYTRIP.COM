#include<bits/stdc++.h>
 #define ll long long
#define pb push_back
 #define f(i, b) for (int i = 0; i < b; i++)
 #define fr(i, a, b) for (int i = a; i >= b; i--)
#define vt vector
 #define all(v) v.begin(), v.end()
 const ll M = 998244353;
using namespace std;
int main(){
    #ifndef ONLINE_JUDGE
        freopen("input.txt", "rt", stdin);
        freopen("output.txt", "wt", stdout);
    #endif
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    int t;
    cin>>t;
    while(t--){
    ll n;cin>>n;
    set<ll>s;
    map<ll,ll >m;
    map<ll,ll>freq1,freq;
    f(i,n)
    {
        ll x;cin>>x;
        s.insert(x);
        freq1[x]++;

    }
    for(auto i:freq1)
    {
        freq[i.second]++;
    }
    ll max1=1,id=1;
    for(auto i:freq){
        if(i.second>=max1){
            max1=i.second;
            id=i.first;
        }
        // cout<<i.first<<" "<<i.second<<endl;
    }
    m[1]=s.size();
    // cout<<id<<" ";
    ll prev=freq[1];
    for(auto i:freq)
    {
        if(i.first==1)continue;
        m[i.first]=s.size()-prev;
        prev+=freq[i.first];
    }
    ll min1=n;
    for(auto i:freq){
        // cout<<i.first<<" "<<m[i.first]<<"\n";
        min1=min(min1,n-m[i.first]*i.first);
    }
    cout<<min1<<"\n";


 
 
    }
    #ifndef ONLINE_JUDGE
        cout<<"\nTime Elapsed : " << 1.0*clock() / CLOCKS_PER_SEC << " s\n";
    #endif
    return 0;
}