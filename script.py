import requests
import time 
import threading


def main():
    api_endpoint = 'http://localhost:8080/booking'

    try:
        response = requests.get(api_endpoint)
        print(response)
        #print(response.json())
    except:
        print('An error occured')
        print(response)

def ddos3():
    api_endpoint = 'http://localhost:8080/index'

    users = 20000
    n=0
    
    while n <= users :
        response = requests.get(api_endpoint)
        print(response)
        print(n)

        if response.status_code != 200:
            print('An error occured -->', response)
            break
            return None
        
        n+=1



#ddos()


def ddos():
    api_endpoint = 'http://localhost:8080/booking'

    users = 20000
    n=0
    
    while n <= users :
        response = requests.get(api_endpoint)
        ddos3()
        print(response)
        print(n)

        if response.status_code != 200:
            print('An error occured -->', response)
            break
            return None
        
        n+=1



# ddos()



def test(): 
    n = 1000000000
    t = 0
    while t < n:
        print(t)
        t +=1


test()



def ddos2(): 
    endpoint = 'http://localhost:8080/booking'
    try:
        response = requests.get(endpoint)
    except Exception as e:
        print('Error -->', e)

    threads = []
    for _ in range(1000):
        t = threading.Thread(target=ddos2)
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

# ddos2()
